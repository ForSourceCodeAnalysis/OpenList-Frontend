import { JSXElement, Match, Switch } from "solid-js"
import { getSetting } from "~/store"

import { cn } from "~/utils"

export const Container = (props: { children: JSXElement; class?: string }) => {
  const container = getSetting("home_container")

  return (
    <Switch
      fallback={
        <div class={cn(props.class, "container mx-auto w-[min(99%,980px)]")}>
          {props.children}
        </div>
      }
    >
      <Match when={container === "hope_container"}>
        <div class={cn(props.class, "container mx-auto")}>{props.children}</div>
      </Match>
    </Switch>
  )
}
