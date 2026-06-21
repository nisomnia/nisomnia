import { Image } from "@unpic/react"
import DOMPurify from "isomorphic-dompurify"
import { memo } from "react"

import type { ContentPart } from "@/lib/parse-content"

function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="relative my-6 aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title="YouTube video"
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

function ContentPartView({ part }: { part: ContentPart }) {
  if (part.type === "image") {
    return (
      <Image
        src={part.src}
        alt={part.alt}
        layout="fullWidth"
        className="my-6 rounded-lg"
      />
    )
  }
  if (part.type === "youtube") {
    return <YouTubeEmbed videoId={part.src} />
  }
  if (part.type === "ad") {
    return (
      <div
        className="my-6"
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
