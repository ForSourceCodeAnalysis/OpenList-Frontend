import { Show, createMemo, createResource, on } from "solid-js"
import { Markdown, MaybeLoading } from "~/components"
import { useLink } from "~/hooks"
import { State, getSettingBool, objStore } from "~/store"
import { fetchText } from "~/utils"

export function Readme(props: {
  files: string[]
  fromMeta: keyof typeof objStore
}) {
  const { proxyLink } = useLink()
  const readme = createMemo(
    on(
      () => objStore.state,
      () => {
        if (
          ![State.FetchingMore, State.Folder, State.File].includes(
            objStore.state,
          )
        ) {
          return ""
        }
        if ([State.FetchingMore, State.Folder].includes(objStore.state)) {
          const obj = objStore.objs.find((item) =>
            props.files.find(
              (file) => file.toLowerCase() === item.name.toLowerCase(),
            ),
          )
          if (obj) {
            return proxyLink(obj, true)
          }
        }
        if (
          objStore[props.fromMeta] &&
          typeof objStore[props.fromMeta] === "string"
        ) {
          return objStore[props.fromMeta] as string
        }
        return ""
      },
    ),
  )
  const fetchContent = async (readme: string) => {
    let res = {
      content: readme as string | ArrayBuffer,
    }
    if (/^https?:\/\//g.test(readme)) {
      res = await fetchText(readme)
    }
    return res
  }
  const [content] = createResource(readme, fetchContent)
  return (
    <Show when={getSettingBool("readme_autorender") && readme()}>
      <div class="w-full rounded-xl bg-base-200 p-4 shadow-lg">
        <MaybeLoading loading={content.loading}>
          <Markdown
            children={content()?.content}
            readme
            toc={props.fromMeta === "readme"}
          />
        </MaybeLoading>
      </div>
    </Show>
  )
}
