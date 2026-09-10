import DOMPurify from "isomorphic-dompurify"
import { memo } from "react"

import type { ContentPart } from "@/lib/parse-content"

import { YouTubeEmbed } from "@/components/article/youtube-embed"
import { Image } from "@/components/image"

function ContentPartView({ part }: { part: ContentPart }) {
  if (part.type === "image") {
    return (
      <div className="reader-media">
        <Image
          src={part.src}
          alt={part.alt}
          layout="constrained"
          width={800}
          sizes="(max-width: 768px) 100vw, 800px"
          background="auto"
          className="h-auto w-full object-contain"
          unstyled
        />
      </div>
    )
  }
  if (part.type === "youtube") {
    return (
      <figure className="reader-media">
        <YouTubeEmbed videoId={part.src} title={part.caption} />
        {part.caption && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground">
            {part.caption}
          </figcaption>
        )}
      </figure>
    )
  }
  if (part.type === "ad") {
    return (
      <div
        className="my-2 max-w-full overflow-hidden"
        dangerouslySetInnerHTML={{ __html: part.content }}
      />
    )
  }
  return (
    <div
      className="max-w-full min-w-0"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(part.content),
      }}
    />
  )
}

export const ArticleContent = memo(function ArticleContent({
  parts,
}: {
  parts: ContentPart[]
}) {
  return (
    <div className="article-content">
      {parts.map((part, i) => (
        <ContentPartView key={`${part.type}-${i}`} part={part} />
      ))}
    </div>
  )
})
