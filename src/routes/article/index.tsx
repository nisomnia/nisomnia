"use client"

import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  fetchArticlesByLanguageInfinite,
  useArticleSearch,
  useArticlesByLanguageInfinite,
} from "@/hooks/api/article"

const PAGE_SIZE = 20

const articleSearchSchema = z.object({
  q: z.string().optional(),
})

export const Route = createFileRoute("/article/")({
  validateSearch: articleSearchSchema,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["articles", "by-language", "id", PAGE_SIZE] as const,
      queryFn: ({ pageParam }) =>
        fetchArticlesByLanguageInfinite(PAGE_SIZE, pageParam),
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
  } = useArticleSearch(q, PAGE_SIZE)
  const {
    data: infiniteData,
    isLoading: infiniteIsLoading,
    isError: infiniteIsError,
    hasNextPage: infiniteHasNextPage,
    isFetchingNextPage: infiniteIsFetchingNextPage,
    fetchNextPage: infiniteFetchNextPage,
  } = useArticlesByLanguageInfinite(PAGE_SIZE)

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

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">Articles</h1>

      {isLoading && (
        <div className="mt-8 flex justify-center">
          <Spinner />
        </div>
      )}

      {isError && (
        <p className="text-destructive mt-8">Failed to load articles.</p>
      )}

      {!isLoading && !isError && articles.length === 0 && (
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
