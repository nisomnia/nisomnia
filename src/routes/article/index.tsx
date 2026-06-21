"use client"

import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { fetchClient } from "@/lib/api/client"

const PAGE_SIZE = 20
const LANGUAGE = "id"

const articleSearchSchema = z.object({
  q: z.string().optional(),
})

export const Route = createFileRoute("/article/")({
  validateSearch: articleSearchSchema,
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
      initialPageParam: null as string | null,
    })
  },
  head: () => ({
    title: "Articles",
    meta: [{ name: "description", content: "Read all articles on Nisomnia" }],
  }),
  component: ArticleListPage,
})

function ArticleListPage() {
  const { q } = Route.useSearch()

  const {
    data: searchData,
    isLoading: searchIsLoading,
    isError: searchIsError,
  } = useQuery({
    enabled: Boolean(q),
    queryKey: ["articles", "search", LANGUAGE, q],
    queryFn: () =>
      fetchClient
        .POST("/article/search", {
          body: { language: LANGUAGE, limit: PAGE_SIZE, searchQuery: q ?? "" },
        })
        .then(({ data, error }) => {
          if (error) throw error
          return data ?? []
        }),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })

  const {
    data: infiniteData,
    isLoading: infiniteIsLoading,
    isError: infiniteIsError,
    hasNextPage: infiniteHasNextPage,
    isFetchingNextPage: infiniteIsFetchingNextPage,
    fetchNextPage: infiniteFetchNextPage,
  } = useInfiniteQuery({
    enabled: !q,
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
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })

  const articles = (searchData ?? []).concat(
    infiniteData?.pages.flatMap((page) => page?.articles ?? []) ?? [],
  )
  const isLoading = searchIsLoading || infiniteIsLoading
  const isError = searchIsError || infiniteIsError
  const hasNextPage = infiniteHasNextPage && !infiniteIsError
  const isFetchingNextPage = infiniteIsFetchingNextPage

  function handleLoadMore() {
    if (!isFetchingNextPage) {
      infiniteFetchNextPage()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="text-muted-foreground" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold">Articles</h1>
        <p className="text-destructive mt-8">Failed to load articles.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-8 text-4xl font-bold">
        {q ? `Search results for “${q}”` : "Articles"}
      </h1>
      {articles.length === 0 && (
        <p className="text-muted-foreground">No articles found.</p>
      )}
      <div className="space-y-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="rounded-lg border p-6 transition-shadow hover:shadow-md"
          >
            <a href={`/article/${article.slug}`}>
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
            </a>
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
