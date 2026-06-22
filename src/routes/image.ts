import { createFileRoute } from "@tanstack/react-router"
import sharp from "sharp"

import { siteConfig } from "@/lib/seo/config"

const ALLOWED_ORIGIN = "https://assets.nisomnia.com"
const CACHE_ONE_DAY = 86400
const MAX_WIDTH = 3840
const DEFAULT_QUALITY = 80

function isAllowedHost(url: URL): boolean {
  return url.origin === ALLOWED_ORIGIN || url.hostname === "assets.nisomnia.com"
}

function badRequest(message: string): Response {
  return new Response(message, {
    status: 400,
    headers: { "Content-Type": "text/plain" },
  })
}

function notFound(): Response {
  return new Response("Not found", { status: 404 })
}

export const Route = createFileRoute("/image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const src = url.searchParams.get("url")
        const widthParam = url.searchParams.get("w")
        const qualityParam = url.searchParams.get("q")

        if (!src) return badRequest("Missing url parameter")

        let sourceUrl: URL
        try {
          sourceUrl = new URL(src)
        } catch {
          return badRequest("Invalid url parameter")
        }

        if (!isAllowedHost(sourceUrl)) {
          return badRequest("Source host not allowed")
        }

        const width = widthParam
          ? Math.min(Math.max(Number.parseInt(widthParam, 10), 1), MAX_WIDTH)
          : undefined

        const quality = qualityParam
          ? Math.min(Math.max(Number.parseInt(qualityParam, 10), 1), 100)
          : DEFAULT_QUALITY

        if (Number.isNaN(width ?? 0) || Number.isNaN(quality)) {
          return badRequest("Invalid width or quality")
        }

        const upstream = await fetch(sourceUrl.toString(), {
          headers: { Accept: "image/*,*/*" },
        })

        if (!upstream.ok) {
          return notFound()
        }

        const contentType = upstream.headers.get("content-type") ?? "image/webp"
        const arrayBuffer = await upstream.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        if (!width && quality === DEFAULT_QUALITY) {
          return new Response(buffer, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": `public, max-age=${CACHE_ONE_DAY}, immutable`,
              "Access-Control-Allow-Origin": siteConfig.siteUrl,
            },
          })
        }

        let pipeline = sharp(buffer, { animated: contentType === "image/gif" })
          .rotate()
          .webp({ quality, effort: 4 })

        if (width) {
          const metadata = await sharp(buffer).metadata()
          const targetWidth = Math.min(
            width,
            metadata.width ? Math.min(metadata.width, MAX_WIDTH) : width,
          )
          pipeline = pipeline.resize({
            width: targetWidth,
            withoutEnlargement: true,
            fit: "inside",
          })
        }

        const output = await pipeline.toBuffer()

        return new Response(output as unknown as BodyInit, {
          headers: {
            "Content-Type": "image/webp",
            "Cache-Control": `public, max-age=${CACHE_ONE_DAY}, immutable`,
            "Access-Control-Allow-Origin": siteConfig.siteUrl,
          },
        })
      },
    },
  },
})
