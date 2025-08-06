import { JSXElement, mergeProps, Show } from "solid-js"
import { cn } from "~/utils"
export const FullScreenLoading = () => {
  return (
    <div class="flex h-screen w-screen items-center justify-center">
      <span class="loading loading-xl loading-spinner text-primary" />
    </div>
  )
}

export const FullLoading = (props: {
  py?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  thickness?: number
  ref?: any
}) => {
  const merged = mergeProps(
    {
      py: "py-8",
      size: "xl",
      thickness: 4,
    },
    props,
  )

  const sizeClass = {
    xs: "loading-xs",
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
    xl: "loading-xl",
  }[merged.size || "xl"]

  return (
    <div
      ref={props.ref}
      class={cn("flex h-full w-full items-center justify-center", merged.py)}
    >
      <span
        class={cn("loading loading-spinner text-primary", sizeClass)}
        style={{ "--thickness": `${merged.thickness}px` }}
      />
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

export const CenterLoading = (size?: "xs" | "sm" | "md" | "lg" | "xl") => {
  const sizeClass = {
    xs: "loading-xs",
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
    xl: "loading-xl",
  }[size || "md"]

  return (
    <div class="flex h-full w-full items-center justify-center">
      <span class={cn("loading loading-spinner text-primary", sizeClass)} />
    </div>
  )
}
