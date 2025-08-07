import { TbExternalLink } from "solid-icons/tb"
import { Component, createMemo } from "solid-js"
import { BoxWithFullScreen } from "~/components"
import { useLink } from "~/hooks"
import { objStore } from "~/store"
import { convertURL } from "~/utils"

const IframePreview = (props: { scheme: string }) => {
  const { currentObjLink } = useLink()
  const iframeSrc = createMemo(() => {
    return convertURL(props.scheme, {
      raw_url: objStore.raw_url,
      name: objStore.obj.name,
      d_url: currentObjLink(true),
      ts: true,
    })
  })
  return (
    <BoxWithFullScreen>
      <iframe
        class="h-full w-full rounded-lg"
        src={iframeSrc()}
        sandbox="allow-scripts allow-same-origin"
        title="Iframe Preview"
      />
      <button
        type="button"
        aria-label="Open in new tab"
        class="btn absolute right-2 bottom-11 btn-circle btn-sm"
        onClick={() => {
          window.open(iframeSrc(), "_blank")
        }}
      >
        <TbExternalLink size={18} />
      </button>
    </BoxWithFullScreen>
  )
}

export const generateIframePreview = (scheme: string): Component => {
  return () => {
    return <IframePreview scheme={scheme} />
  }
}
