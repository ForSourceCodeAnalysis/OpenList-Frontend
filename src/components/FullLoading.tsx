import { JSXElement, mergeProps, Show } from "solid-js"
import { cn } from "~/utils"

type LoadingSize = "xs" | "sm" | "md" | "lg" | "xl"

type LoadingProps = {
  size?: LoadingSize
  class?: string
}

export const Loading = (props: LoadingProps) => {
  const sizeClass = {
    xs: "loading-xs",
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
    xl: "loading-xl",
  }[props.size || "md"]

  return (
    <span
      class={cn("loading loading-spinner text-primary", sizeClass, props.class)}
    />
  )
}

export const FullScreenLoading = () => {
  return (
    <div class="flex h-screen w-screen items-center justify-center">
      <Loading size="xl" />
    </div>
  )
}

export const FullLoading = (props: {
  py?: string
  size?: LoadingSize
  ref?: any
}) => {
  return (
    <div
      ref={props.ref}
      class={cn(
        "flex h-full w-full items-center justify-center",
        props.py ? `py${props.py.replaceAll("$", "")}` : "py-8",
      )}
    >
      <Loading size={props.size} />
    </div>
  )
}

export const MaybeLoading = (props: {
  children?: JSXElement
  loading?: boolean
}) => {
  return (
    <Show when={!props.loading} fallback={<FullLoading />}>
      {props.children}
    </Show>
  )
}

export const CenterLoading = (props: LoadingProps) => {
  return (
    <div class="flex h-full w-full items-center justify-center">
      <Loading {...props} />
    </div>
  )
}
