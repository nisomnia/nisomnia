import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { fetchClient } from "@/lib/api/client"

const PAGE_SIZE = 20
const LANGUAGE = "id"

export const Route = createFileRoute("/topic/$slug/")({
  loader: async ({ params, context: { queryClient } }) => {
    const { data: topic, error } = await fetchClient.GET(
      "/topic/by-slug/{slug}",
      {
        params: { path: { slug: params.slug } },
      },
    )
    if (error) throw error
    if (topic) {
      await queryClient.prefetchInfiniteQuery({
        queryKey: ["articles", "by-topic", topic.id, LANGUAGE, PAGE_SIZE],
        queryFn: ({ pageParam }) =>
          fetchClient
            .POST("/article/by-topic-id-infinite", {
              body: {
                topicId: topic.id,
                language: LANGUAGE,
                limit: PAGE_SIZE,
                cursor: pageParam,
              },
            })
            .then(({ data, error }) => {
              if (error) throw error
              return data
            }),
        initialPageParam: null as string | null,
      })
    }
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
  } = useQuery({
    queryKey: ["topic", "by-slug", slug],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/topic/by-slug/{slug}", {
        params: { path: { slug } },
      })
      if (error) throw error
      return data
    },
    staleTime: 5 * 60 * 1000,
  })

  const {
    data: infiniteData,
    isLoading: articlesIsLoading,
    isError: articlesIsError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    enabled: Boolean(topic?.id),
    queryKey: ["articles", "by-topic", topic?.id, LANGUAGE, PAGE_SIZE],
    queryFn: ({ pageParam }) =>
      fetchClient
        .POST("/article/by-topic-id-infinite", {
          body: {
            topicId: topic!.id,
            language: LANGUAGE,
            limit: PAGE_SIZE,
            cursor: pageParam,
          },
        })
        .then(({ data, error }) => {
          if (error) throw error
          return data
        }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })

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
        <Button className="mt-6" render={<Link to="/" />}>
          Go home
        </Button>
      </div>
    )
  }

  const articles = infiniteData?.pages.flatMap((page) => page.articles) ?? []

  function handleLoadMore() {
    if (!isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-8 text-4xl font-bold">{topic.title}</h1>
      {topic.description && (
        <p className="text-muted-foreground mt-4 text-lg">
          {topic.description}
        </p>
      )}

      {articlesIsLoading && (
        <div className="flex items-center justify-center p-8">
          <Spinner className="text-muted-foreground" />
        </div>
      )}

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
          <Button disabled={isFetchingNextPage} onClick={handleLoadMore}>
            {isFetchingNextPage && <Spinner />}
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        )}
      </div>
    </div>
  )
}
