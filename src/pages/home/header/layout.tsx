import { For } from "solid-js"
import { Dynamic } from "solid-js/web"
import { BsGridFill, BsCardImage } from "solid-icons/bs"
import { FaSolidListUl } from "solid-icons/fa"
import { LayoutType, layout, setLayout } from "~/store"
import { useT } from "~/hooks"

const layouts = {
  list: FaSolidListUl,
  grid: BsGridFill,
  image: BsCardImage,
} as const

export const Layout = () => {
  const t = useT()

  return (
    <div role="tablist" class="tabs flex flex-nowrap tabs-box tabs-sm">
      <For each={Object.entries(layouts)}>
        {([key, Icon]) => (
          <button
            role="tab"
            class={`tab ${layout() === key ? "tab-active" : ""}`}
            onClick={() => setLayout(key as LayoutType)}
            aria-selected={layout() === key}
            title={t(`home.layouts.${key}`)}
          >
            <Dynamic component={Icon} />
          </button>
        )}
      </For>
    </div>
  )
}
