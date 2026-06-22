import DOMPurify from "isomorphic-dompurify"
import { memo } from "react"

import type { ContentPart } from "@/lib/parse-content"

import { YouTubeEmbed } from "@/components/article/youtube-embed"
import { Image } from "@/components/image"

function ContentPartView({ part }: { part: ContentPart }) {
  if (part.type === "image") {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={part.src}
          alt={part.alt}
          layout="constrained"
          width={800}
          height={450}
          sizes="(max-width: 768px) 100vw, 800px"
          background="auto"
          className="h-full w-full object-cover"
          unstyled
        />
      </div>
    )
  }
  if (part.type === "youtube") {
    return (
      <figure className="my-4">
        <YouTubeEmbed videoId={part.src} title={part.caption} />
        {part.caption && (
          <figcaption className="text-muted-foreground mt-2 text-center text-sm">
            {part.caption}
          </figcaption>
        )}
      </figure>
    )
  }
  if (part.type === "ad") {
    return (
      <div
        className="my-2"
        dangerouslySetInnerHTML={{ __html: part.content }}
      />
    )
  }
  return (
    <div
      className="prose max-w-none space-y-2"
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
