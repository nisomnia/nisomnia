import { Link } from "@tanstack/react-router"
import DOMPurify from "isomorphic-dompurify"
import { memo } from "react"

import type { ContentPart } from "@/lib/parse-content"

import { YouTubeEmbed } from "@/components/article/youtube-embed"
import { Image } from "@/components/image"

function ContentPartView({
  part,
  articleSlug,
  watchableVideoIds,
}: {
  part: ContentPart
  articleSlug: string
  watchableVideoIds: string[]
}) {
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
    const isWatchable = watchableVideoIds.includes(part.src)
    return (
      <figure className="reader-media">
        <YouTubeEmbed videoId={part.src} title={part.caption} />
        {(part.caption ?? isWatchable) && (
          <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            {part.caption && <span>{part.caption}</span>}
            {isWatchable && (
              <Link
                to="/article/$slug/video/$videoId"
                params={{ slug: articleSlug, videoId: part.src }}
              >
                Tonton di halaman video
              </Link>
            )}
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
  articleSlug,
  watchableVideoIds,
}: {
  parts: ContentPart[]
  articleSlug: string
  watchableVideoIds: string[]
}) {
  return (
    <div className="article-content">
      {parts.map((part, i) => (
        <ContentPartView
          key={`${part.type}-${i}`}
          part={part}
          articleSlug={articleSlug}
          watchableVideoIds={watchableVideoIds}
        />
      ))}
    </div>
  )
})
