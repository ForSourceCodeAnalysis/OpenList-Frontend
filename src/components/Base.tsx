import { Select } from "@kobalte/core/select"
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "solid-icons/ai"
import { TbCheck } from "solid-icons/tb"
import { createSignal, mergeProps, Show } from "solid-js"
import { cn } from "~/utils"
import { SwitchColorMode } from "./SwitchColorMode"

export const Error = (props: {
  msg: string
  disableColor?: boolean
  h?: string
}) => {
  const merged = mergeProps(
    {
      h: "$full",
    },
    props,
  )
  return (
    <div
      class={cn(
        "flex flex-col items-center justify-center p-2",
        props.h ? `h-[${props.h}]` : "h-full",
      )}
    >
      <div class="rounded-box bg-base-200 px-4 py-6">
        <h2 class="break-after-all">{props.msg}</h2>
        <Show when={!props.disableColor}>
          <div class="mt-2 flex justify-end">
            <SwitchColorMode />
          </div>
        </Show>
      </div>
    </div>
  )
}

export const BoxWithFullScreen = (props: {
  class?: string
  children?: any
}) => {
  const [isOpen, setIsOpen] = createSignal(false)
  const onToggle = () => setIsOpen(!isOpen())
  return (
    <div
      class={cn(
        isOpen() ? "fixed h-screen w-screen" : `relative h-[80vh] w-full`,
        "top-0 left-0 z-[1] transition-all duration-200 ease-in-out",
        isOpen() && "backdrop-blur-[5px]",
        props.class,
      )}
    >
      {props.children}
      <button
        type="button"
        aria-label="toggle fullscreen"
        class="btn absolute right-2 bottom-2 btn-circle btn-sm"
        onClick={onToggle}
      >
        {isOpen() ? (
          <AiOutlineFullscreenExit size={18} />
        ) : (
          <AiOutlineFullscreen size={18} />
        )}
      </button>
    </div>
  )
}

export function SelectWrapper<T extends string | number>(props: {
  value: T
  onChange: (v: T) => void
  options: {
    value: T
    label?: string
  }[]
  alwaysShowBorder?: boolean
  size?: "xs" | "sm" | "md" | "lg"
  w?: string // TODO
}) {
  const getSelected = () => props.options.find((o) => o.value === props.value)

  return (
    <Select
      class="w-full"
      slide={true}
      value={String(props.value)}
      onChange={(v) => {
        const found = props.options.find((o) => String(o.value) === v)
        if (found) props.onChange(found.value)
      }}
      options={props.options.map((o) => String(o.value))}
      placeholder={getSelected()?.label ?? getSelected()?.value ?? ""}
      itemComponent={(itemProps) => {
        const val = itemProps.item.rawValue
        const opt = props.options.find((o) => String(o.value) === val)
        return (
          <Select.Item item={itemProps.item}>
            <Select.ItemLabel class="data-[selected]:bg-base-300">
              {opt?.label ?? opt?.value ?? val}
              <Select.ItemIndicator class="absolute right-2 flex items-center justify-center text-primary">
                <TbCheck />
              </Select.ItemIndicator>
            </Select.ItemLabel>
          </Select.Item>
        )
      }}
    >
      <Select.Trigger
        class={cn(
          "select w-full",
          {
            xs: "select-xs",
            sm: "select-sm",
            md: "select-md",
            lg: "select-lg",
          }[props.size ?? "md"],
          props.alwaysShowBorder ? "" : "",
        )}
        aria-label="select"
        style={props.w ? { width: props.w } : undefined}
      >
        <Select.Value<T>>
          {(state) => {
            const sel = state.selectedOption() as string | number | undefined
            if (sel == null) return null
            const opt = props.options.find(
              (o) => String(o.value) === String(sel),
            )
            return opt?.label ?? opt?.value ?? sel
          }}
        </Select.Value>
        {/* <Select.Icon>↓</Select.Icon> */}
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="z-50 max-h-[60vh] overflow-y-auto rounded-box bg-base-200">
          <Select.Listbox class="menu w-full" />
        </Select.Content>
      </Select.Portal>
    </Select>
  )
}
