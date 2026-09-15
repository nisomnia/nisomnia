import { createServerFn } from "@tanstack/react-start"

import type { VideoMeta } from "./types"

const YOUTUBE_VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/
const YOUTUBE_ID_RE =
  /(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/

export function extractYouTubeIds(content: string): string[] {
  const ids = new Set<string>()
  const iframeRe = /<iframe[^>]+src="([^"]+)"[^>]*>/gi
  for (const match of content.matchAll(iframeRe)) {
    const src = match[1]
    if (!src) continue
    const idMatch = src.match(YOUTUBE_ID_RE)
    if (idMatch?.[1]) ids.add(idMatch[1])
  }
  return Array.from(ids)
}

async function fetchYouTubeMeta(videoId: string): Promise<VideoMeta | null> {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    })
    if (!res.ok) return null
    const html = await res.text()
    const meta = (re: RegExp) => html.match(re)?.[1]?.trim()
    const name =
      meta(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/) ??
      meta(/<meta\s+name=["']title["']\s+content=["']([^"']*)["']/)
    const desc =
      meta(
        /<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/,
      ) ?? meta(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/)
    const thumbnail =
      meta(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/) ??
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    const uploadDate = meta(
      /<meta\s+itemprop=["']datePublished["']\s+content=["']([^"']*)["']/,
    )
    const duration = meta(
      /<meta\s+itemprop=["']duration["']\s+content=["']([^"']*)["']/,
    )
    const width = meta(
      /<meta\s+property=["']og:video:width["']\s+content=["']([^"']*)["']/,
    )
    const height = meta(
      /<meta\s+property=["']og:video:height["']\s+content=["']([^"']*)["']/,
    )
    if (!name) return null
    return {
      videoId,
      title: name,
      description: desc ?? "",
      thumbnailUrl: thumbnail,
      uploadDate: uploadDate ?? null,
      duration: duration ?? null,
      width: width ? Number(width) : undefined,
      height: height ? Number(height) : undefined,
    }
  } catch {
    return null
  }
}

function validateVideoIds(value: unknown): string[] {
  if (!Array.isArray(value)) throw new Error("Invalid YouTube video IDs")

  const videoIds: string[] = []
  for (const videoId of value) {
    if (typeof videoId !== "string" || !YOUTUBE_VIDEO_ID_RE.test(videoId)) {
      throw new Error("Invalid YouTube video IDs")
    }
    videoIds.push(videoId)
  }
  return Array.from(new Set(videoIds))
}

export const fetchAllVideoMeta = createServerFn({ method: "GET" })
  .validator(validateVideoIds)
  .handler(async ({ data }) => {
    const results = await Promise.all(data.map(fetchYouTubeMeta))
    return results.filter((video): video is VideoMeta => video !== null)
  })
