import { createFileRoute, Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  fetchArticlesByTopicIdInfinite,
  useArticlesByTopicIdInfinite,
} from "@/hooks/api/article"
import {
  fetchTopicBySlug,
  prefetchTopicBySlug,
  useTopicBySlug,
} from "@/hooks/api/topic"

const PAGE_SIZE = 20

export const Route = createFileRoute("/topic/$slug/")({
  loader: async ({ params, context: { queryClient } }) => {
    const topic = await fetchTopicBySlug(params.slug)
    if (topic) {
      await queryClient.prefetchInfiniteQuery({
        queryKey: ["articles", "by-topic", topic.id, "id", PAGE_SIZE] as const,
        queryFn: ({ pageParam }) =>
          fetchArticlesByTopicIdInfinite(topic.id, PAGE_SIZE, pageParam),
        initialPageParam: null as string | null,
      })
    }
    await prefetchTopicBySlug(queryClient, params.slug)
  },
  head: () => ({
    title: "Topic",
    meta: [{ name: "description", content: "Browse articles by topic" }],
  }),
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
        <p className="text-destructive mt-8">Failed to load articles.</p>
      )}

      {!articlesIsLoading && !articlesIsError && articles.length === 0 && (
        <p className="text-muted-foreground mt-8">No articles found.</p>
      )}

      <div className="mt-8 space-y-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="rounded-lg border p-6 transition-shadow hover:shadow-md"
          >
            <Link to="/article/$slug" params={{ slug: article.slug }}>
              {article.featuredImage && (
                <img
                  alt={article.metaTitle ?? article.title}
                  className="mb-4 w-full rounded-lg object-cover"
                  src={article.featuredImage}
                />
              )}
              <h2 className="text-2xl font-semibold hover:underline">
                {article.title}
              </h2>
              <p className="text-muted-foreground mt-2">{article.excerpt}</p>
            </Link>
            {article.createdAt && (
              <time className="text-muted-foreground mt-4 block text-sm">
                {new Date(article.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </article>
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
