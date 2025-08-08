import { onCleanup, onMount } from "solid-js"
import { Error, FullLoading, ImageWithError } from "~/components"
import { useRouter, useT } from "~/hooks"
import { objStore } from "~/store"
import { ObjType } from "~/types"

const Preview = () => {
  const t = useT()
  const { replace } = useRouter()
  let images = objStore.objs.filter((obj) => obj.type === ObjType.IMAGE)
  if (images.length === 0) {
    images = [objStore.obj]
  }
  const onKeydown = (e: KeyboardEvent) => {
    const index = images.findIndex((f) => f.name === objStore.obj.name)
    if (e.key === "ArrowLeft" && index > 0) {
      replace(images[index - 1].name)
    } else if (e.key === "ArrowRight" && index < images.length - 1) {
      replace(images[index + 1].name)
    }
  }
  onMount(() => {
    window.addEventListener("keydown", onKeydown)
  })
  onCleanup(() => {
    window.removeEventListener("keydown", onKeydown)
  })
  return (
    <ImageWithError
      class="max-h-[75vh] rounded-lg"
      src={objStore.raw_url}
      fallback={<FullLoading />}
      fallbackErr={<Error msg={t("home.preview.failed_load_img")} />}
    />
  )
}

export default Preview
