"use client"

import { Link } from "@tanstack/react-router"
import { useEffect, useRef } from "react"

import { Spinner } from "@/components/ui/spinner"
import {
  useArticleBySlug,
  useRelatedArticlesInfinite,
} from "@/hooks/api/article"

const PAGE_SIZE = 10

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
  } = useArticleBySlug(currentSlug)

  const currentArticleId = currentArticle?.id
  const topicId = currentArticle?.topics[0]?.id

  const {
    data: infiniteData,
    isLoading: infiniteIsLoading,
    isError: infiniteIsError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useRelatedArticlesInfinite(currentArticleId, topicId, PAGE_SIZE)

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
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">Failed to load related articles.</p>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">No related articles found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            to="/article/$slug"
            params={{ slug: article.slug }}
            className="flex gap-4 rounded-lg border p-4 transition-shadow hover:shadow-md"
          >
            {article.featuredImage && (
              <img
                alt={article.metaTitle ?? article.title}
                className="aspect-[4/3] w-20 shrink-0 rounded-lg object-cover sm:w-32"
                src={article.featuredImage}
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold sm:text-lg">
                {article.title}
              </h3>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs sm:text-sm">
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
            </div>
          </Link>
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
