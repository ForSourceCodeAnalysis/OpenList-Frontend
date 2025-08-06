import { Link } from "@solidjs/router"
import { AnchorWithBase } from "~/components"
import { useT } from "~/hooks"
import { me } from "~/store"
import { UserMethods } from "~/types"

export const Footer = () => {
  const t = useT()
  return (
    <div class="flex w-full flex-row items-center justify-center gap-1 py-4">
      <a
        class="btn btn-ghost"
        href="https://github.com/OpenListTeam/OpenList"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("home.footer.powered_by")}
      </a>
      <span>|</span>
      <AnchorWithBase
        class="btn btn-ghost"
        href={UserMethods.is_guest(me()) ? "/@login" : "/@manage"}
      >
        {t(UserMethods.is_guest(me()) ? "login.login" : "home.footer.manage")}
      </AnchorWithBase>
    </div>
  )
}
