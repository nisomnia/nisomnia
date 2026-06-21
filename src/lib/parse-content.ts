import { parse } from "node-html-parser"

export interface HtmlContentPart {
  type: "html"
  content: string
}

export interface ImageContentPart {
  type: "image"
  src: string
  alt: string
}

export interface YouTubeContentPart {
  type: "youtube"
  src: string
}

export interface AdContentPart {
  type: "ad"
  content: string
}

export type ContentPart =
  | HtmlContentPart
  | ImageContentPart
  | YouTubeContentPart
  | AdContentPart

const AD_UNIT = `<ins
  class="adsbygoogle manual-adsense h-auto w-screen min-w-full sm:w-full"
  style="display:block"
  data-ad-client="ca-pub-4946821479056257"
  data-ad-slot="6709218890"
  data-ad-format="auto"
  data-full-width-responsive="true"></ins>`

function extractYouTubeId(src: string): string {
  try {
    const url = new URL(src)
    if (src.includes("youtube.com/embed/")) {
      return src.split("/embed/")[1]?.split("?")[0] ?? ""
    }
    if (src.includes("youtube.com/watch")) {
      return url.searchParams.get("v") ?? ""
    }
    if (src.includes("youtu.be")) {
      return src.split("/").pop()?.split("?")[0] ?? ""
    }
  } catch {
    return ""
  }
  return ""
}

export function parseContent(
  content: string,
  defaultAlt: string,
): ContentPart[] {
  if (!content) return []

  const contentParts: ContentPart[] = []
  const root = parse(content)

  const images = root.querySelectorAll("img")
  const iframes = root.querySelectorAll("iframe")
  const youtubeIframes = iframes.filter((iframe) => {
    const src = iframe.getAttribute("src") ?? ""
    return src.includes("youtube.com") || src.includes("youtu.be")
  })

  const elementsToProcess = [
    ...images.map((img) => ({ element: img, type: "image" as const })),
    ...youtubeIframes.map((iframe) => ({
      element: iframe,
      type: "youtube" as const,
    })),
  ].sort((a, b) => {
    const aPos = content.indexOf(a.element.toString())
    const bPos = content.indexOf(b.element.toString())
    return aPos - bPos
  })

  if (elementsToProcess.length > 0) {
    let currentPos = 0

    for (const { element, type } of elementsToProcess) {
      const elemPos = content.indexOf(element.toString(), currentPos)
      if (elemPos > currentPos) {
        contentParts.push({
          type: "html",
          content: content.substring(currentPos, elemPos),
        })
      }

      if (type === "image") {
        contentParts.push({
          type: "image",
          src: element.getAttribute("src") ?? "",
          alt: element.getAttribute("alt") ?? defaultAlt,
        })
      } else if (type === "youtube") {
        const src = element.getAttribute("src") ?? ""
        contentParts.push({
          type: "youtube",
          src: extractYouTubeId(src),
        })
      }

      currentPos = elemPos + element.toString().length
    }

    if (currentPos < content.length) {
      contentParts.push({
        type: "html",
        content: content.substring(currentPos),
      })
    }
  } else {
    contentParts.push({ type: "html", content })
  }

  const middleIndex = Math.floor(contentParts.length / 2)
  const result: ContentPart[] = []

  for (const part of contentParts.slice(0, middleIndex)) {
    result.push(part)
  }
  result.push({ type: "ad", content: AD_UNIT })
  for (const part of contentParts.slice(middleIndex)) {
    result.push(part)
  }

  return result
}
