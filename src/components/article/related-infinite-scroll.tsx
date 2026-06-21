"use client"

import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

import { fetchClient } from "@/api/client"
import { Spinner } from "@/components/ui/spinner"

const PAGE_SIZE = 10
const LANGUAGE = "id"

interface RelatedInfiniteScrollProps {
  currentSlug: string
}

export function RelatedInfiniteScroll({
  currentSlug,
}: RelatedInfiniteScrollProps) {
  const {
    data: currentArticle,
    isLoading: articleIsLoading,
    isError: articleIsError,
  } = useQuery({
    queryKey: ["article", "by-slug", currentSlug],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/article/by-slug/{slug}", {
        params: { path: { slug: currentSlug } },
      })
      if (error) throw error
      return data
    },
    staleTime: 5 * 60 * 1000,
  })

  const currentArticleId = currentArticle?.id
  const topicId = currentArticle?.topics[0]?.id

  const {
    data: infiniteData,
    isLoading: infiniteIsLoading,
    isError: infiniteIsError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    enabled: Boolean(currentArticleId) && Boolean(topicId),
    queryKey: ["articles", "related", currentArticleId, topicId, PAGE_SIZE],
    queryFn: ({ pageParam }) =>
      fetchClient
        .POST("/article/related-infinite", {
          body: {
            currentArticleId: currentArticleId!,
            topicId: topicId!,
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
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = sentinelRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: "200px" },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const articles =
    infiniteData?.pages.flatMap((page) => page?.articles ?? []) ?? []
  const isLoading = articleIsLoading || infiniteIsLoading
  const isError = articleIsError || infiniteIsError

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="text-muted-foreground" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Failed to load related articles.</p>
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Articles</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {articles.map((article) => (
          <article
            key={article.id}
            className="rounded-lg border p-4 transition-shadow hover:shadow-md"
          >
            {article.featuredImage && (
              <img
                alt={article.metaTitle ?? article.title}
                className="mb-3 aspect-video w-full rounded-lg object-cover"
                src={article.featuredImage}
              />
            )}
            <h3 className="text-lg font-semibold">{article.title}</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {article.excerpt}
            </p>
            {article.createdAt && (
              <time className="text-muted-foreground mt-2 block text-xs">
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
      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-4">
          <Spinner className="text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
