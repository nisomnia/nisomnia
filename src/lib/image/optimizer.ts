import { useStorage as getStorage } from "nitro/storage"
import sharp from "sharp"

import { siteConfig } from "@/lib/seo/config"

const ALLOWED_ORIGIN = "https://assets.nisomnia.com"
const CACHE_ONE_YEAR = 31536000
const MAX_WIDTH = 3840
const DEFAULT_QUALITY = 75
const CACHE_VERSION = "v1"

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

function buildCacheKey(url: URL): string {
  const src = url.searchParams.get("url")
  const width = url.searchParams.get("w")
  const quality = url.searchParams.get("q")
  if (!src) return ""
  const normalized = new URL(src)
  normalized.search = ""
  normalized.hash = ""
  return `image:${CACHE_VERSION}:${normalized.pathname}:${width ?? "orig"}:${quality ?? "default"}`
}

interface CachedImage {
  body: string
  contentType: string
  cacheControl: string
}

async function getCachedImage(key: string): Promise<Response | undefined> {
  const storage = getStorage("cache")
  const entry = await storage.getItem<CachedImage>(key)
  if (!entry) return undefined
  const body = Buffer.from(entry.body, "base64")
  return new Response(body as unknown as BodyInit, {
    headers: {
      "Content-Type": entry.contentType,
      "Cache-Control": entry.cacheControl,
      "Access-Control-Allow-Origin": siteConfig.siteUrl,
    },
  })
}

async function setCachedImage(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  const storage = getStorage("cache")
  const entry: CachedImage = {
    body: body.toString("base64"),
    contentType,
    cacheControl: `public, max-age=${CACHE_ONE_YEAR}, immutable`,
  }
  await storage.setItem(key, entry, { ttl: CACHE_ONE_YEAR })
}

export async function optimizeImageRequest(
  requestUrl: string,
): Promise<Response> {
  const url = new URL(requestUrl)
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

  const cacheKey = buildCacheKey(url)
  if (cacheKey) {
    const cached = await getCachedImage(cacheKey)
    if (cached) return cached
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

  const isGif = contentType === "image/gif"
  const pipeline = sharp(buffer, { animated: isGif })
    .rotate()
    .webp({
      quality,
      effort: 4,
      smartSubsample: true,
      nearLossless: quality >= 90,
    })

  if (width && !isGif) {
    pipeline.resize({
      width,
      withoutEnlargement: true,
      fit: "inside",
    })
  }

  const output = await pipeline.toBuffer()
  const response = new Response(output as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": `public, max-age=${CACHE_ONE_YEAR}, immutable`,
      "Access-Control-Allow-Origin": siteConfig.siteUrl,
    },
  })

  if (cacheKey) {
    await setCachedImage(cacheKey, output, "image/webp")
  }

  return response
}
