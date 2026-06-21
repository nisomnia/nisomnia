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
import { siteConfig } from "@/lib/seo/config"
import {
  breadcrumbJsonLd,
  buildGraph,
  imageObjectJsonLd,
  jsonLdScript,
  newsArticleJsonLd,
  organizationJsonLd,
  placeJsonLd,
  videoObjectJsonLd,
  websiteJsonLd,
  webpageJsonLd,
} from "@/lib/seo/json-ld"
import { buildSeoMeta } from "@/lib/seo/meta"

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

    const videoIds = extractYouTubeIds(article.content)
    const videoMeta = await Promise.all(
      videoIds.map(async (videoId) => {
        try {
          const res = await fetch(
            `https://www.youtube.com/oEmbed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
          )
          if (!res.ok) return null
          const data = (await res.json()) as {
            title: string
            author_name: string
            thumbnail_url: string
          }
          return { videoId, ...data }
        } catch {
          return null
        }
      }),
    )

    return {
      article,
      videoMeta: videoMeta.filter(
        (v): v is NonNullable<typeof v> => v !== null,
      ),
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { title: "Article", meta: [], links: [] }
    const { article, videoMeta } = loaderData
    const url = `${siteConfig.siteUrl}/article/${article.slug}`
    const title = article.metaTitle ?? article.title
    const description = article.metaDescription ?? article.excerpt ?? ""
    const primaryTopic = article.topics[0]
    const authorName = article.authors[0]?.name ?? article.authors[0]?.username
    const seo = buildSeoMeta({
      title,
      description,
      url,
      type: "article",
      image: article.featuredImage
        ? { url: article.featuredImage, alt: article.title }
        : undefined,
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      section: primaryTopic?.title,
      tags: article.topics.map((t) => t.title),
      canonical: url,
    })
    const breadcrumb = breadcrumbJsonLd([
      { name: "Home", url: siteConfig.siteUrl },
      ...(primaryTopic
        ? [
            {
              name: primaryTopic.title,
              url: `${siteConfig.siteUrl}/topic/${primaryTopic.slug}`,
            },
          ]
        : []),
      { name: article.title, url },
    ])
    const videoIds = extractYouTubeIds(article.content)
    const videos = videoIds.map((videoId) => {
      const meta = videoMeta.find((v) => v.videoId === videoId)
      return videoObjectJsonLd({
        name: meta?.title ?? article.title,
        description: description,
        videoId,
        uploadDate: article.createdAt,
        thumbnailUrl: meta?.thumbnail_url,
      })
    })
    return {
      ...seo,
      scripts: [
        jsonLdScript(
          buildGraph([
            placeJsonLd(),
            organizationJsonLd(),
            websiteJsonLd(),
            ...(article.featuredImage
              ? [
                  imageObjectJsonLd({
                    url: article.featuredImage,
                    caption: article.title,
                  }),
                ]
              : []),
            ...videos,
            breadcrumb,
            webpageJsonLd({
              name: article.title,
              url,
              description,
              datePublished: article.createdAt,
              dateModified: article.updatedAt,
              imageUrl: article.featuredImage,
              breadcrumb,
            }),
            newsArticleJsonLd({
              headline: article.title,
              description,
              url,
              imageUrl: article.featuredImage,
              imageCaption: article.title,
              datePublished: article.createdAt,
              dateModified: article.updatedAt,
              authorName,
              section: primaryTopic?.title,
              keywords: article.topics.map((t) => t.title),
              breadcrumb,
            }),
          ]),
        ),
      ],
    }
  },
  component: ArticlePage,
})

function ArticlePage() {
  const { slug } = Route.useParams()
  const { article } = Route.useLoaderData()
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

const YOUTUBE_ID_RE =
  /(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/

function extractYouTubeIds(content: string): string[] {
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
