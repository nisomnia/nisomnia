import { useStorage as getStorage } from "nitro/storage"

import { siteConfig } from "@/lib/seo/config"

const ALLOWED_ORIGIN = "https://assets.nisomnia.com"
const CACHE_ONE_YEAR_SECONDS = 31536000
const MAX_WIDTH = 3840
const DEFAULT_QUALITY = 75
const CACHE_VERSION = "v1"
const CACHE_PREFIX = `image:${CACHE_VERSION}`

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
  return `${CACHE_PREFIX}:${normalized.pathname}:${width ?? "orig"}:${quality ?? "default"}`
}

export async function clearImageCache(): Promise<number> {
  const storage = getStorage("cache")
  const keys = await storage.getKeys(CACHE_PREFIX)
  await Promise.all(keys.map((key) => storage.removeItem(key)))
  return keys.length
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
  return new Response(body, {
    headers: {
      "Content-Type": entry.contentType,
      "Cache-Control": entry.cacheControl,
      "Access-Control-Allow-Origin": siteConfig.siteUrl,
    },
  })
}

async function setCachedImage(
  key: string,
  body: Uint8Array,
  contentType: string,
): Promise<void> {
  const storage = getStorage("cache")
  const entry: CachedImage = {
    body: Buffer.from(body).toString("base64"),
    contentType,
    cacheControl: `public, max-age=${CACHE_ONE_YEAR_SECONDS}, immutable`,
  }
  await storage.setItem(key, entry)
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

  const arrayBuffer = await upstream.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  let image = new Bun.Image(buffer).webp({ quality })

  if (width) {
    image = image.resize(width, undefined, {
      withoutEnlargement: true,
      fit: "inside",
    })
  }

  const output = await image.bytes()
  const response = new Response(Uint8Array.from(output), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": `public, max-age=${CACHE_ONE_YEAR_SECONDS}, immutable`,
      "Access-Control-Allow-Origin": siteConfig.siteUrl,
    },
  })

  if (cacheKey) {
    await setCachedImage(cacheKey, output, "image/webp")
  }

  return response
}
