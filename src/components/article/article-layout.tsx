import { Link } from "@tanstack/react-router"
import { Image } from "@unpic/react"
import { useMemo } from "react"

import type { ArticleResponse } from "@/hooks/api/article"

import { ArticleContent } from "@/components/article/article-content"
import { ArticleShareBar } from "@/components/article/article-share-bar"
import { ArticleTableOfContents } from "@/components/article/article-table-of-contents"
import { RelatedInfiniteScroll } from "@/components/article/related-infinite-scroll"
import { useIsMobile } from "@/hooks/use-media-query"
import { extractHeadings } from "@/lib/article/headings"
import { parseContent } from "@/lib/parse-content"
import { siteConfig } from "@/lib/seo/config"

interface ArticleLayoutProps {
  article: NonNullable<ArticleResponse>
  slug: string
}

export function ArticleLayout({ article, slug }: ArticleLayoutProps) {
  const isMobile = useIsMobile()

  const { parts, headings } = useMemo(() => {
    if (!article.content) return { parts: [], headings: [] }
    const withHeadings = extractHeadings(article.content)
    return {
      parts: parseContent(withHeadings.html, article.title),
      headings: withHeadings.headings,
    }
  }, [article.content, article.title])

  const articleUrl = `${siteConfig.siteUrl}/article/${slug}`

  const toc = headings.length > 0 && (
    <ArticleTableOfContents
      headings={headings}
      variant={isMobile ? "collapsible" : "desktop-collapsible"}
    />
  )

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-12 md:py-12 lg:px-16 lg:py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[auto_1fr_280px]">
        <aside className="hidden lg:sticky lg:top-24 lg:flex lg:flex-col lg:items-end lg:self-start">
          <ArticleShareBar
            url={articleUrl}
            title={article.title}
            className="bg-background/80 rounded-2xl border p-2 shadow-lg backdrop-blur-md"
          />
        </aside>
        <main className="min-w-0">
          <article>
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">
              {article.title}
            </h1>
            <div className="text-muted-foreground mb-8 flex flex-wrap items-center gap-4 text-sm" />
            {article.featuredImage && (
              <div className="mb-6 aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={article.featuredImage}
                  alt={article.metaTitle ?? article.title}
                  layout="fullWidth"
                  objectFit="cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 1024px"
                  background="auto"
                  className="h-full w-full"
                />
              </div>
            )}
            {isMobile && toc}
            <ArticleContent parts={parts} />
            {article.topics.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.topics.map((topic) => (
                  <Link
                    key={topic.id}
                    to="/topic/$slug"
                    params={{ slug: topic.slug }}
                    className="bg-muted text-muted-foreground hover:bg-muted/80 rounded-full px-3 py-1 text-sm font-medium"
                  >
                    {topic.title}
                  </Link>
                ))}
              </div>
            )}
          </article>
          <div className="mt-12">
            <RelatedInfiniteScroll currentSlug={slug} />
          </div>
        </main>
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          {!isMobile && toc}
        </aside>
      </div>
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 lg:hidden">
        <ArticleShareBar
          url={articleUrl}
          title={article.title}
          className="bg-background/80 rounded-2xl border p-2 shadow-lg backdrop-blur-md"
        />
      </div>
    </div>
  )
}
