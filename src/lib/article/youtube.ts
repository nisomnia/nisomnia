import type { VideoMeta } from "./types"

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

export async function fetchYouTubeMeta(
  videoId: string,
): Promise<VideoMeta | null> {
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

export async function fetchAllVideoMeta(
  videoIds: string[],
): Promise<VideoMeta[]> {
  const results = await Promise.all(videoIds.map(fetchYouTubeMeta))
  return results.filter((v): v is VideoMeta => v !== null)
}
