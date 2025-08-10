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

export type ContentPart =
  | HtmlContentPart
  | ImageContentPart
  | YouTubeContentPart

/**
 * Parses HTML content and splits it into parts separating images from text
 * @param content HTML content to parse
 * @param defaultAlt Default alt text to use for images without alt attribute
 * @returns Array of content parts (HTML and images)
 */
export function parseContent(
  content: string,
  defaultAlt: string,
): ContentPart[] {
  if (!content) return []

  const contentParts: ContentPart[] = []

  // Parse the HTML content
  const root = parse(content)

  // Find all image elements
  const images = root.querySelectorAll("img")
  // Find all YouTube iframes
  const iframes = root.querySelectorAll("iframe")
  const youtubeIframes = iframes.filter((iframe) => {
    const src = iframe.getAttribute("src") ?? ""
    return src.includes("youtube.com") || src.includes("youtu.be")
  })

  // Combine and sort all elements to process by their position in content
  const elementsToProcess = [
    ...images.map((img) => ({ element: img, type: "image" })),
    ...youtubeIframes.map((iframe) => ({ element: iframe, type: "youtube" })),
  ].sort((a, b) => {
    const aPos = content.indexOf(a.element.toString())
    const bPos = content.indexOf(b.element.toString())
    return aPos - bPos
  })

  if (elementsToProcess.length > 0) {
    // Process each element and split content around them
    let currentPos = 0

    elementsToProcess.forEach(({ element, type }) => {
      const elemPos = content.indexOf(element.toString(), currentPos)
      if (elemPos > currentPos) {
        // Add the content before the element
        contentParts.push({
          type: "html",
          content: content.substring(currentPos, elemPos),
        })
      }

      // Add the element as a separate part
      if (type === "image") {
        const img = element
        contentParts.push({
          type: "image",
          src: img.getAttribute("src") ?? "",
          alt: img.getAttribute("alt") ?? defaultAlt,
        })
      } else if (type === "youtube") {
        const iframe = element
        const src = iframe.getAttribute("src") ?? ""
        let videoSrc = ""

        if (src.includes("youtube.com/embed/")) {
          videoSrc = src.split("/embed/")[1]?.split("?")[0] ?? ""
        } else if (src.includes("youtube.com/watch")) {
          videoSrc = new URL(src).searchParams.get("v") ?? ""
        } else if (src.includes("youtu.be")) {
          videoSrc = src.split("/").pop()?.split("?")[0] ?? ""
        }
        contentParts.push({
          type: "youtube",
          src: videoSrc,
        })
      }

      currentPos = elemPos + element.toString().length
    })

    // Add remaining content after the last element
    if (currentPos < content.length) {
      contentParts.push({
        type: "html",
        content: content.substring(currentPos),
      })
    }
  } else {
    // No special elements found, just add the content as is
    contentParts.push({
      type: "html",
      content: content,
    })
  }

  // Split the content into two parts with a heading in the middle
  const result: ContentPart[] = []
  const middleIndex = Math.floor(contentParts.length / 2)

  // Add first half
  result.push(...contentParts.slice(0, middleIndex))

  // Add the heading in the middle
  result.push({
    type: "html",
    content: `<ins 
      class="adsbygoogle manual-adsense h-auto w-screen min-w-full sm:w-full"
      style="display:block"
      data-ad-client="ca-pub-4946821479056257"
      data-ad-slot="6709218890"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>`,
  })

  // Add second half
  result.push(...contentParts.slice(middleIndex))

  return result
}
