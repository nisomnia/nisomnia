"use client"

import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import { ArticleCard } from "@/components/article/article-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  fetchArticlesByLanguageInfinite,
  useArticleSearch,
  useArticlesByLanguageInfinite,
} from "@/hooks/api/article"
import { siteConfig } from "@/lib/seo/config"
import { buildSeoMeta } from "@/lib/seo/meta"

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
  head: ({ match }) => {
    const q = (match.search as { q?: string }).q?.trim()
    const url = `${siteConfig.siteUrl}/article`
    const isSearching = Boolean(q)
    const seo = buildSeoMeta({
      title: q
        ? `Search: ${q} - ${siteConfig.siteName}`
        : `Articles - ${siteConfig.siteName}`,
      description: q
        ? `Search results for "${q}" on ${siteConfig.siteName}`
        : `Read all articles on ${siteConfig.siteName}`,
      url,
      canonical: url,
      noindex: isSearching,
    })
    return {
      title: seo.title,
      meta: seo.meta,
      links: seo.links,
    }
  },
  component: ArticleListPage,
})

function ArticleListPage() {
  const { q } = Route.useSearch()
  const searchQuery = q?.trim()
  const isSearching = Boolean(searchQuery)

  const {
    data: searchData,
    isLoading: searchIsLoading,
    isError: searchIsError,
  } = useArticleSearch(searchQuery, PAGE_SIZE)
  const {
    data: infiniteData,
    isLoading: infiniteIsLoading,
    isError: infiniteIsError,
    hasNextPage: infiniteHasNextPage,
    isFetchingNextPage: infiniteIsFetchingNextPage,
    fetchNextPage: infiniteFetchNextPage,
  } = useArticlesByLanguageInfinite(PAGE_SIZE)

  const searchResults = searchData ?? []
  const listArticles =
    infiniteData?.pages.flatMap((page) => page?.articles ?? []) ?? []
  const articles = isSearching ? searchResults : listArticles

  const isLoading = isSearching ? searchIsLoading : infiniteIsLoading
  const isError = isSearching ? searchIsError : infiniteIsError

  const hasNextPage = !isSearching && infiniteHasNextPage && !infiniteIsError
  const isFetchingNextPage = !isSearching && infiniteIsFetchingNextPage

  function handleLoadMore() {
    if (!infiniteIsFetchingNextPage) {
      infiniteFetchNextPage()
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      {isSearching ? (
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Search results</h1>
          <p className="text-muted-foreground">
            {isLoading
              ? "Searching..."
              : `Found ${articles.length} ${
                  articles.length === 1 ? "article" : "articles"
                } for "${searchQuery}"`}
          </p>
        </div>
      ) : (
        <h1 className="text-3xl font-bold">Articles</h1>
      )}

      {isLoading && (
        <div className="mt-8 flex justify-center">
          <Spinner />
        </div>
      )}

      {isError && (
        <p className="text-destructive mt-8" role="alert">
          Failed to load articles.
        </p>
      )}

      {!isLoading && !isError && articles.length === 0 && (
        <p className="text-muted-foreground mt-8">
          {isSearching
            ? `No articles found for "${searchQuery}".`
            : "No articles found."}
        </p>
      )}

      <div className="space-y-6">
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
          <Button disabled={isFetchingNextPage} onClick={handleLoadMore}>
            {isFetchingNextPage && <Spinner />}
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        )}
      </div>
    </div>
  )
}
