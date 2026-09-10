import { Link } from "@tanstack/react-router"
import { useMemo } from "react"

import type { ArticleResponse } from "@/hooks/api/article"

import { ArticleContent } from "@/components/article/article-content"
import { ArticleShareBar } from "@/components/article/article-share-bar"
import { ArticleTableOfContents } from "@/components/article/article-table-of-contents"
import { RelatedInfiniteScroll } from "@/components/article/related-infinite-scroll"
import { Image } from "@/components/image"
import { extractHeadings } from "@/lib/article/headings"
import { parseContent } from "@/lib/parse-content"
import { siteConfig } from "@/lib/seo/config"

interface ArticleLayoutProps {
  article: NonNullable<ArticleResponse>
  slug: string
}

export function ArticleLayout({ article, slug }: ArticleLayoutProps) {
  const { parts, headings } = useMemo(() => {
    if (!article.content) return { parts: [], headings: [] }
    const withHeadings = extractHeadings(article.content)
    return {
      parts: parseContent(withHeadings.html, article.title),
      headings: withHeadings.headings,
    }
  }, [article.content, article.title])

  const articleUrl = `${siteConfig.siteUrl}/article/${slug}`

  return (
    <div className="page-shell reader-shell">
      <Link to="/article" className="eyebrow inline-flex min-h-11 items-center">
        Semua artikel
      </Link>
      <div className="grid min-w-0 gap-12 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <article>
            <div className="reader-heading">
              <h1>{article.title}</h1>
              {article.excerpt && <p>{article.excerpt}</p>}
              <ArticleShareBar url={articleUrl} title={article.title} />
            </div>
            {article.featuredImage && (
              <div className="mb-10 aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl">
                <Image
                  src={article.featuredImage}
                  alt={article.metaTitle ?? article.title}
                  layout="constrained"
                  width={1024}
                  height={576}
                  priority
                  sizes="(max-width: 768px) 100vw, 760px"
                  background="auto"
                  className="size-full object-cover"
                  unstyled
                />
              </div>
            )}
            <div className="xl:hidden">
              <ArticleTableOfContents
                headings={headings}
                variant="collapsible"
              />
            </div>
            <ArticleContent parts={parts} />
            {article.topics.length > 0 && (
              <nav
                aria-label="Topik artikel"
                className="mt-10 flex flex-wrap gap-2 border-t pt-6"
              >
                {article.topics.map((topic) => (
                  <Link
                    key={topic.id}
                    to="/topic/$slug"
                    params={{ slug: topic.slug }}
                    className="inline-flex min-h-11 items-center rounded-full bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    {topic.title}
                  </Link>
                ))}
              </nav>
            )}
          </article>
          <div className="mt-16 border-t pt-10">
            <RelatedInfiniteScroll currentSlug={slug} />
          </div>
        </div>
        <aside className="hidden xl:sticky xl:top-28 xl:block xl:self-start">
          <ArticleTableOfContents
            headings={headings}
            variant="desktop-collapsible"
          />
        </aside>
      </div>
    </div>
  )
}
