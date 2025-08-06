import { JSXElement } from "solid-js"
import { useRouter, useT } from "~/hooks"

type PasswordProps = {
  title: string
  password: () => string
  setPassword: (s: string) => void
  enterCallback: () => void
  children?: JSXElement
}

const Password = (props: PasswordProps) => {
  const t = useT()
  const { back } = useRouter()
  return (
    <div class="flex w-full flex-col items-start gap-3 p-8 md:w-lg">
      <h2>{props.title}</h2>
      <input
        class="input w-full"
        type="password"
        value={props.password()}
        autofocus
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            props.enterCallback()
          }
        }}
        onInput={(e) => props.setPassword(e.currentTarget.value)}
      ></input>
      <div class="flex w-full flex-row items-center justify-between">
        <div class="flex flex-col gap-1 text-sm sm:flex-row">
          {props.children}
        </div>
        <div class="flex flex-row items-center gap-2">
          <button class="btn" onClick={back}>
            {t("global.back")}
          </button>
          <button class="btn btn-primary" onClick={() => props.enterCallback()}>
            {t("global.ok")}
          </button>
        </div>
      </div>
    </div>
  )
}
export default Password
