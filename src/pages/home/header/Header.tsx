import { BsSearch } from "solid-icons/bs"
import { createMemo, Show } from "solid-js"
import { ImageWithError, Loading } from "~/components"
import { getSetting, local, objStore, State } from "~/store"
import { bus, cn } from "~/utils"
import { isMac } from "~/utils/compatibility"
import { Container } from "../Container"
import { BreadCrumbs } from "./BreadCrumbs"
import { Layout } from "./layout"

export const Header = () => {
  const logos = getSetting("logo").split("\n")
  const logo = createMemo(() => {
    // 使用daisyUI的颜色模式检测
    const isDarkMode = document.documentElement.classList.contains("dark")
    return isDarkMode ? logos.pop() : logos[0]
  })

  const stickyClass = createMemo(() => {
    switch (local["position_of_header_navbar"]) {
      case "sticky":
        return "sticky top-0 z-50"
      default:
        return ""
    }
  })

  return (
    <div class={cn("header w-full bg-base-200 pb-2 shadow-lg", stickyClass())}>
      <Container>
        <div class="navbar flex flex-row items-center justify-between">
          <div class="flex-1">
            <ImageWithError
              class="btn btn-ghost"
              src={logo()!}
              alt="Logo"
              fallback={<Loading size="lg" />}
              fallbackErr={<Loading size="lg" />}
            />
          </div>
          <div class="flex items-center gap-2">
            <Show when={objStore.state === State.Folder}>
              <Show when={getSetting("search_index") !== "none"}>
                <button
                  class="btn input cursor-pointer btn-sm"
                  onClick={() => {
                    bus.emit("tool", "search")
                  }}
                >
                  <BsSearch />
                  <div class="flex items-center gap-1">
                    <kbd class="kbd kbd-xs">{isMac ? "⌘" : "Ctrl"}</kbd>+
                    <kbd class="kbd kbd-xs">K</kbd>
                  </div>
                </button>
              </Show>
              <Layout />
            </Show>
          </div>
        </div>
        <BreadCrumbs />
      </Container>
    </div>
  )
}
