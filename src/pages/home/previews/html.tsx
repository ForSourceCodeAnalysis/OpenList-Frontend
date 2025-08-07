import { hope } from "@hope-ui/solid"
import { Show, createSignal } from "solid-js"
import { BoxWithFullScreen, EncodingSelect, MaybeLoading } from "~/components"
import { useFetchText, useParseText } from "~/hooks"

function Html(props: { children?: string | ArrayBuffer }) {
  const [encoding, setEncoding] = createSignal<string>("utf-8")
  const { isString, text } = useParseText(props.children)
  return (
    <BoxWithFullScreen>
      <iframe
        class="h-full w-full rounded-box"
        srcdoc={text(encoding())}
        sandbox="allow-scripts allow-same-origin "
        title="HTML Preview"
      />
      <Show when={!isString}>
        <EncodingSelect
          encoding={encoding()}
          setEncoding={setEncoding}
          referenceText={props.children}
        />
      </Show>
    </BoxWithFullScreen>
  )
}

const HtmlPreview = () => {
  const [content] = useFetchText()

  return (
    <MaybeLoading loading={content.loading}>
      <Html>{content()?.content}</Html>
    </MaybeLoading>
  )
}

export default HtmlPreview
