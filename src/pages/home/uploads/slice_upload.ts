import { password } from "~/store"
import { EmptyResp } from "~/types"
import { r, pathDir, log } from "~/utils"
import { SetUpload, Upload } from "./types"
import pLimit from "p-limit"
import {
  calculateHash,
  calculateSliceHash,
  fsUploadInfo,
  fsPreup,
  FsSliceupComplete,
  HashType,
} from "./util"
import { sleep } from "seemly"

export const sliceupload = async (
  uploadPath: string,
  file: File,
  setUpload: SetUpload,
  overwrite = false,
): Promise<Error | undefined> => {
  let hashtype: string = HashType.Md5
  let slicehash: string[] = []
  let sliceupstatus: Uint8Array
  let ht: string[] = []

  const dir = pathDir(uploadPath)

  //获取上传需要的信息
  const resp = await fsUploadInfo(dir)
  if (resp.code != 200) {
    return new Error(resp.message)
  }
  // hash计算
  if (resp.data.hash_md5_need) {
    ht.push(HashType.Md5)
    hashtype = HashType.Md5
  }
  if (resp.data.hash_sha1_need) {
    ht.push(HashType.Sha1)
    hashtype = HashType.Sha1
  }
  if (resp.data.hash_md5_256kb_need) {
    ht.push(HashType.Md5256kb)
  }
  const hash = await calculateHash(file, ht)
  // 预上传
  const resp1 = await fsPreup(dir, file.name, file.size, hash, overwrite)
  if (resp1.code != 200) {
    return new Error(resp1.message)
  }
  if (resp1.data.reuse) {
    setUpload("progress", "100")
    setUpload("status", "success")
    setUpload("speed", "0")
    return
  }
  //计算分片hash
  if (resp.data.slice_hash_need) {
    slicehash = await calculateSliceHash(file, resp1.data.slice_size, hashtype)
  }
  // 分片上传
  sliceupstatus = base64ToUint8Array(resp1.data.slice_upload_status)

  // 进度和速度统计
  let uploadedBytes = 0
  let lastTimestamp = Date.now()
  let lastUploadedBytes = 0
  const totalSize = file.size

  // 上传分片的核心函数，带进度和速度统计
  const uploadChunk = async (
    chunk: Blob,
    idx: number,
    slice_hash: string,
    upload_id: number,
  ) => {
    const formData = new FormData()
    formData.append("upload_id", upload_id.toString())
    formData.append("slice_hash", slice_hash)
    formData.append("slice_num", idx.toString())
    formData.append("slice", chunk)

    let oldTimestamp = Date.now()
    let oldLoaded = 0

    const resp: EmptyResp = await r.post("/fs/slice_upload", formData, {
      headers: {
        "File-Path": encodeURIComponent(dir),
        "Content-Type": "multipart/form-data",
        Password: password(),
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          uploadedBytes += progressEvent.loaded - oldLoaded
          oldLoaded = progressEvent.loaded
          const complete = Math.min(
            100,
            ((uploadedBytes / totalSize) * 100) | 0,
          )
          setUpload("progress", complete)
          const now = Date.now()
          const duration = (now - lastTimestamp) / 1000
          if (duration > 0.2) {
            const speed = (uploadedBytes - lastUploadedBytes) / duration
            setUpload("speed", speed)
            lastTimestamp = now
            lastUploadedBytes = uploadedBytes
          }
        }
      },
    })
    log("response", idx)
    log(resp)
    log("response end")
    if (resp.code != 200) {
      throw new Error(resp.message)
    }
  }

  // 先上传第一个分片，slicehash全部用逗号拼接传递
  if (!isSliceUploaded(sliceupstatus, 0)) {
    const chunk = file.slice(0, resp1.data.slice_size)
    try {
      await uploadChunk(
        chunk,
        0,
        slicehash.length == 0 ? "" : slicehash.join(","),
        resp1.data.upload_id,
      )
    } catch (err) {
      setUpload("status", "error")
      setUpload("speed", 0)
      return err as Error
    }
    setUpload(
      "progress",
      Math.min(100, ((uploadedBytes / totalSize) * 100) | 0),
    )
  } else {
    uploadedBytes += Math.min(resp1.data.slice_size, totalSize)
  }

  // 后续分片并发上传，限制并发数为3
  const limit = pLimit(3)
  const tasks: Promise<void>[] = []
  const errors: Error[] = []
  for (let i = 1; i < resp1.data.slice_cnt; i++) {
    if (!isSliceUploaded(sliceupstatus, i)) {
      const chunk = file.slice(
        i * resp1.data.slice_size,
        (i + 1) * resp1.data.slice_size,
      )
      tasks.push(
        limit(async () => {
          try {
            await uploadChunk(
              chunk,
              i,
              slicehash.length == 0 ? "" : slicehash[i],
              resp1.data.upload_id,
            )
          } catch (err) {
            errors.push(err as Error)
          }
        }),
      )
    } else {
      uploadedBytes += Math.min(
        resp1.data.slice_size,
        totalSize - i * resp1.data.slice_size,
      )
    }
  }
  await Promise.all(tasks)

  // 最终处理上传结果
  if (errors.length > 0) {
    setUpload("status", "error")
    setUpload("speed", 0)
    setUpload(
      "progress",
      Math.min(100, ((uploadedBytes / totalSize) * 100) | 0),
    )
    return errors[0]
  } else {
    const resp = await FsSliceupComplete(dir, resp1.data.upload_id)
    if (resp.code != 200) {
      setUpload("status", "error")
      return new Error(resp.message)
    } else if (resp.data.complete == 0) {
      setUpload("status", "error")
      return new Error("slice missing, please reupload")
    } else if (resp.data.complete == 2) {
      setUpload("status", "queued")
    }
    setUpload("progress", 100)

    setUpload("speed", 0)
    return
  }
}

// 解码 base64 字符串为 Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

// 判断第 idx 个分片是否已上传
const isSliceUploaded = (status: Uint8Array, idx: number): boolean => {
  //   const bytes = base64ToUint8Array(statusBase64)
  const byteIdx = Math.floor(idx / 8)
  const bitIdx = idx % 8
  if (byteIdx >= status.length) return false
  return (status[byteIdx] & (1 << bitIdx)) !== 0
}
