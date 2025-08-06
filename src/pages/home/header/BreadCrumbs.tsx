import { Link } from "@solidjs/router"
import { createMemo, For, Show } from "solid-js"
import { usePath, useRouter, useT } from "~/hooks"
import { getSetting } from "~/store"
import { encodePath, joinBase } from "~/utils"

export const BreadCrumbs = () => {
  const { pathname } = useRouter()
  const paths = createMemo(() => ["", ...pathname().split("/").filter(Boolean)])
  const t = useT()
  const { setPathAs } = usePath()

  return (
    <div class="breadcrumbs px-4">
      <ul>
        <For each={paths()}>
          {(name, i) => {
            const isLast = createMemo(() => i() === paths().length - 1)
            const path = paths()
              .slice(0, i() + 1)
              .join("/")
            const href = encodePath(path)
            let text = () => name
            if (text() === "") {
              text = () => getSetting("home_icon") + t("manage.sidemenu.home")
            }

            return (
              <li>
                <Show when={!isLast()} fallback={<span>{text()}</span>}>
                  <Link
                    href={joinBase(href)}
                    onMouseEnter={() => setPathAs(path)}
                  >
                    {text()}
                  </Link>
                </Show>
              </li>
            )
          }}
        </For>
      </ul>
    </div>
  )
}
