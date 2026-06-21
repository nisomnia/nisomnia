import { createFileRoute } from "@tanstack/react-router"

import { ArticleCard } from "@/components/article/article-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  prefetchArticlesByTopicId,
  useArticlesByTopicIdInfinite,
} from "@/hooks/api/article"
import { fetchTopicBySlug, useTopicBySlug } from "@/hooks/api/topic"
import { siteConfig } from "@/lib/seo/config"
import {
  breadcrumbJsonLd,
  buildGraph,
  collectionPageJsonLd,
  jsonLdScript,
  organizationJsonLd,
  placeJsonLd,
  websiteJsonLd,
} from "@/lib/seo/json-ld"
import { buildSeoMeta } from "@/lib/seo/meta"

const PAGE_SIZE = 20

export const Route = createFileRoute("/topic/$slug/")({
  loader: async ({ params, context: { queryClient } }) => {
    const topic = await fetchTopicBySlug(params.slug)
    if (topic) {
      await prefetchArticlesByTopicId(queryClient, topic.id, PAGE_SIZE)
    }
    return topic
  },
  head: ({ loaderData: topic }) => {
    if (!topic) return { title: "Topic not found", meta: [], links: [] }
    const url = `${siteConfig.siteUrl}/topic/${topic.slug}`
    const title = topic.metaTitle ?? topic.title
    const description = topic.metaDescription ?? topic.description ?? ""
    const seo = buildSeoMeta({
      title,
      description,
      url,
      type: "article",
      image: topic.featuredImage
        ? { url: topic.featuredImage, alt: topic.title }
        : undefined,
      canonical: url,
      hreflang: [{ lang: "id", href: url }],
    })
    const breadcrumb = breadcrumbJsonLd([
      { name: "Home", url: siteConfig.siteUrl },
      { name: "Topics", url: `${siteConfig.siteUrl}/topic` },
      { name: topic.title, url },
    ])
    return {
      ...seo,
      scripts: [
        jsonLdScript(
          buildGraph([
            placeJsonLd(),
            organizationJsonLd(),
            websiteJsonLd(),
            breadcrumb,
            collectionPageJsonLd({
              name: topic.title,
              url,
              description,
              breadcrumb,
            }),
          ]),
        ),
      ],
    }
  },
  component: TopicPage,
})

function TopicPage() {
  const { slug } = Route.useParams()
  const {
    data: topic,
    isLoading: topicIsLoading,
    isError: topicIsError,
  } = useTopicBySlug(slug)
  const {
    data: infiniteData,
    isLoading: articlesIsLoading,
    isError: articlesIsError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useArticlesByTopicIdInfinite(topic?.id, PAGE_SIZE)

  const articles =
    infiniteData?.pages.flatMap((page) => page?.articles ?? []) ?? []

  if (topicIsLoading) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <div className="bg-muted h-8 w-48 animate-pulse rounded" />
      </div>
    )
  }

  if (topicIsError || !topic) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <h1 className="text-2xl font-semibold">Topic not found</h1>
        <p className="text-muted-foreground mt-2">
          We could not find a topic for “{slug}”.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">{topic.title}</h1>

      {articlesIsError && (
        <p className="text-destructive mt-8" role="alert">
          Failed to load articles.
        </p>
      )}

      {!articlesIsLoading && !articlesIsError && articles.length === 0 && (
        <p className="text-muted-foreground mt-8">No articles found.</p>
      )}

      <div className="mt-8 space-y-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            excerpt={article.excerpt}
            featuredImage={article.featuredImage}
            slug={article.slug}
            title={article.title}
            titleClassName="sm:text-xl md:text-2xl lg:text-4xl"
            excerptClassName="sm:text-sm md:text-base lg:text-xl lg:line-clamp-none"
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        {hasNextPage && (
          <Button disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
            {isFetchingNextPage && <Spinner />}
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        )}
      </div>
    </div>
  )
}
