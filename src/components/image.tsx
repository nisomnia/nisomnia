import type { ImageProps } from "@unpic/react/base"
import type { CSSProperties, ReactElement } from "react"

import {
  blurhashToImageCssObject,
  blurhashToImageCssString,
} from "@unpic/placeholder"
import { Image as UnpicImage } from "@unpic/react/base"

const ASSETS_HOST = "https://assets.nisomnia.com"

export type NisomniaImageProps = Omit<
  ImageProps<
    {
      width?: number | string
      height?: number | string
      quality?: number | string
    },
    never
  >,
  "transformer"
> & {
  blurHash?: string
}

function isAssetsUrl(src: string): boolean {
  return src.startsWith(ASSETS_HOST) || src.includes("assets.nisomnia.com")
}

export function nisomniaTransformer(
  src: string | URL,
  operations: {
    width?: number | string
    height?: number | string
    quality?: number | string
  },
): string {
  const srcString = src.toString()

  if (!isAssetsUrl(srcString)) {
    return srcString
  }

  const target = new URL(
    "/image",
    typeof window === "undefined" ? "http://localhost" : window.location.origin,
  )
  target.searchParams.set("url", srcString)

  if (operations.width) {
    target.searchParams.set("w", String(Math.round(Number(operations.width))))
  }
  if (operations.height) {
    target.searchParams.set("h", String(Math.round(Number(operations.height))))
  }
  if (operations.quality) {
    target.searchParams.set("q", String(Math.round(Number(operations.quality))))
  }

  return target.pathname + target.search
}

export function Image({ blurHash, ...props }: NisomniaImageProps) {
  const placeholderStyle = blurHash
    ? blurhashToImageCssObject(blurHash, 32, 32)
    : undefined

  const imageProps = props as Record<string, unknown>
  const existingStyle = imageProps.style as CSSProperties | undefined
  const style: CSSProperties | undefined = placeholderStyle
    ? existingStyle
      ? { ...placeholderStyle, ...existingStyle }
      : placeholderStyle
    : existingStyle

  delete imageProps.style

  const UnpicImageAny = UnpicImage as unknown as (
    props: Record<string, unknown>,
  ) => ReactElement

  return (
    <UnpicImageAny
      {...imageProps}
      transformer={nisomniaTransformer}
      style={style}
    />
  )
}

export { blurhashToImageCssString }
