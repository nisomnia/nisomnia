import { useInfiniteQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { fetchClient } from "@/api/client"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const PAGE_SIZE = 20
const LANGUAGE = "id"

export const Route = createFileRoute("/article/")({
  head: () => ({
    title: "Articles",
    meta: [{ name: "description", content: "Read all articles on Nisomnia" }],
  }),
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["articles", "by-language", LANGUAGE, PAGE_SIZE],
      queryFn: ({ pageParam }) =>
        fetchClient
          .POST("/article/by-language-infinite", {
            body: {
              language: LANGUAGE,
              limit: PAGE_SIZE,
              cursor: pageParam,
            },
          })
          .then(({ data, error }) => {
            if (error) throw error
            return data
          }),
      initialPageParam: undefined as string | undefined,
    })
  },
  component: ArticleListPage,
})

function ArticleListPage() {
  const query = useInfiniteQuery({
    queryKey: ["articles", "by-language", LANGUAGE, PAGE_SIZE],
    queryFn: ({ pageParam }) =>
      fetchClient
        .POST("/article/by-language-infinite", {
          body: {
            language: LANGUAGE,
            limit: PAGE_SIZE,
            cursor: pageParam,
          },
        })
        .then(({ data, error }) => {
          if (error) throw error
          return data
        }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })

  const [autoLoad, setAutoLoad] = useState(false)

  const articles =
    query.data?.pages.flatMap((page) => page?.articles ?? []) ?? []
  const hasNextPage = query.hasNextPage && !query.isError
  const isFetchingNextPage = query.isFetchingNextPage

  useEffect(() => {
    if (autoLoad && hasNextPage && !isFetchingNextPage) {
      query.fetchNextPage()
    }
  }, [autoLoad, hasNextPage, isFetchingNextPage, query.fetchNextPage])

  function handleLoadMore() {
    setAutoLoad(true)
    if (!isFetchingNextPage) {
      query.fetchNextPage()
    }
  }

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="text-muted-foreground" />
      </div>
    )
  }

  if (query.isError) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold">Articles</h1>
        <p className="text-destructive mt-8">Failed to load articles.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Articles</h1>
      {articles.length === 0 ? (
        <p className="text-muted-foreground">No articles found.</p>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="rounded-lg border p-6 transition-shadow hover:shadow-md"
            >
              {article.featuredImage && (
                <img
                  alt={article.metaTitle ?? article.title}
                  className="mb-4 w-full rounded-lg object-cover"
                  src={article.featuredImage}
                />
              )}
              <h2 className="text-2xl font-semibold">{article.title}</h2>
              <p className="text-muted-foreground mt-2">{article.excerpt}</p>
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
      )}
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
