import { createFileRoute, Link } from "@tanstack/react-router"
import { Image } from "@unpic/react"
import { useMemo } from "react"

import { ArticleContent } from "@/components/article/article-content"
import { ArticleShareBar } from "@/components/article/article-share-bar"
import { ArticleTableOfContents } from "@/components/article/article-table-of-contents"
import { RelatedInfiniteScroll } from "@/components/article/related-infinite-scroll"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-media-query"
import { fetchClient } from "@/lib/api/client"
import { parseContent } from "@/lib/parse-content"

interface Author {
  id: string
  name: string | null
  username: string
}

interface Topic {
  id: string
  title: string
  slug: string
}

interface Article {
  id: string
  language: "id" | "en"
  title: string
  slug: string
  content: string
  excerpt: string
  metaTitle: string | null
  metaDescription: string | null
  status: "published" | "draft" | "rejected" | "in_review"
  visibility: "public" | "member"
  articleTranslationId: string
  featuredImage: string
  createdAt: string | null
  updatedAt: string | null
  topics: Topic[]
  authors: Author[]
  editors: { id: string; name: string | null }[]
}

export const Route = createFileRoute("/article/$slug")({
  loader: async ({ params, context: { queryClient } }) => {
    const { slug } = params
    const article = await queryClient.fetchQuery({
      queryKey: ["article", "by-slug", slug],
      queryFn: async () => {
        const { data, error } = await fetchClient.GET(
          "/article/by-slug/{slug}",
          {
            params: { path: { slug } },
          },
        )
        if (error) throw error
        return data as Article
      },
    })
    return article
  },
  head: ({ loaderData }) => ({
    title: loaderData?.metaTitle ?? loaderData?.title ?? "Article",
    meta: [
      {
        name: "description",
        content: loaderData?.metaDescription ?? loaderData?.excerpt ?? "",
      },
    ],
  }),
  component: ArticlePage,
})

function ArticlePage() {
  const { slug } = Route.useParams()
  const article = Route.useLoaderData()
  const isMobile = useIsMobile()

  const { parts, headings } = useMemo(() => {
    if (!article?.content) return { parts: [], headings: [] }
    const withHeadings = extractHeadings(article.content)
    return {
      parts: parseContent(withHeadings.html, article.title),
      headings: withHeadings.headings,
    }
  }, [article?.content, article?.title])

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <h1 className="text-2xl font-semibold">Article not found</h1>
        <p className="text-muted-foreground mt-2">
          Could not find article &ldquo;{slug}&rdquo;.
        </p>
        <Button className="mt-6" render={<Link to="/article" />}>
          Browse articles
        </Button>
      </div>
    )
  }

  const articleUrl = `https://nisomnia.com/article/${slug}`

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
            <div className="text-muted-foreground mb-8 flex flex-wrap items-center gap-4 text-sm">
              {/**
              {article.createdAt && (
                <time dateTime={article.createdAt}>
                  {new Date(article.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              **/}
              {/**
              {article.authors.length > 0 && (
                <span>
                  {article.authors.map((a) => a.name ?? a.username).join(", ")}
                </span>
              )} 
            **/}
            </div>
            {article.featuredImage && (
              <Image
                src={article.featuredImage}
                alt={article.metaTitle ?? article.title}
                layout="fullWidth"
                aspectRatio={16 / 9}
                objectFit="cover"
                priority
                className="mb-6 rounded-lg"
              />
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
                    className="bg-muted text-muted-foreground hover:bg-muted/80 rounded-full px-3 py-1 text-xs font-medium"
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

function extractHeadings(html: string): {
  html: string
  headings: { id: string; text: string; level: number }[]
} {
  const headings: { id: string; text: string; level: number }[] = []
  const slugCounts = new Map<string, number>()

  const processedHtml = html.replace(
    /<h([1-6])[^>]*>(.*?)<\/h\1>/gi,
    (_match, level, innerHtml) => {
      const text = innerHtml.replace(/<[^>]+>/g, "").trim()
      let id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 50)

      const count = (slugCounts.get(id) ?? 0) + 1
      slugCounts.set(id, count)
      if (count > 1) {
        id = `${id}-${count}`
      }

      headings.push({ id, text, level: parseInt(level, 10) })
      return `<h${level} id="${id}">${innerHtml}</h${level}>`
    },
  )

  return { html: processedHtml, headings }
}
