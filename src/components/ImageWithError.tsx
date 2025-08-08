import { JSX, JSXElement, Show, createSignal } from "solid-js"

export const ImageWithError = (
  props: JSX.ImgHTMLAttributes<HTMLImageElement> & {
    // 加载中的占位符
    fallback?: JSXElement
    // 错误时的占位符
    fallbackErr?: JSXElement
  },
) => {
  const { fallback, fallbackErr, ...imgProps } = props

  const [hasError, setHasError] = createSignal(false)
  const [isLoading, setIsLoading] = createSignal(true)

  return (
    <>
      <Show when={!hasError()} fallback={fallbackErr}>
        <img
          {...imgProps}
          onLoad={() => {
            // img加载时没有大小
            setIsLoading(false)
            setHasError(false)
          }}
          onError={() => {
            // img加载错误会有错误图标，需要隐藏img
            setIsLoading(false)
            setHasError(true)
          }}
        />
        <Show when={isLoading()}>{fallback}</Show>
      </Show>
    </>
  )
}
