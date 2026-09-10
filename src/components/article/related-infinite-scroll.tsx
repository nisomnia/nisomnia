"use client"

import { useCallback } from "react"

import {
  ArticleCard,
  ArticleRowSkeleton,
} from "@/components/article/article-card"
import { Button } from "@/components/ui/button"
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
    refetch: refetchArticle,
  } = useArticleBySlug(currentSlug)

  const currentArticleId = currentArticle?.id
  const topicId = currentArticle?.topics[0]?.id

  const {
    data: infiniteData,
    isLoading: infiniteIsLoading,
    isError: infiniteIsError,
    refetch,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useRelatedArticlesInfinite(currentArticleId, topicId, PAGE_SIZE)

  const observe = useCallback(
    (element: HTMLDivElement | null) => {
      if (
        !element ||
        infiniteIsError ||
        !hasNextPage ||
        isFetchingNextPage ||
        typeof IntersectionObserver === "undefined"
      )
        return
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
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage, infiniteIsError],
  )

  const articles =
    infiniteData?.pages.flatMap((page) => page?.articles ?? []) ?? []
  const isLoading = articleIsLoading || infiniteIsLoading
  const isError = articleIsError || infiniteIsError

  if (isLoading) {
    return (
      <div role="status" className="article-list">
        <span className="sr-only">Memuat artikel terkait...</span>
        <ArticleRowSkeleton />
        <ArticleRowSkeleton />
      </div>
    )
  }

  if (isError && articles.length === 0) {
    return (
      <div className="inline-status">
        <p role="alert">Artikel terkait belum dapat dimuat.</p>
        <Button
          variant="outline"
          onClick={() => (articleIsError ? refetchArticle() : refetch())}
        >
          Coba lagi
        </Button>
      </div>
    )
  }

  if (articles.length === 0) {
    return <p className="inline-status">Belum ada artikel terkait.</p>
  }

  return (
    <section aria-label="Artikel terkait" className="flex flex-col gap-6">
      <h2 className="section-title">Baca selanjutnya</h2>
      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            slug={article.slug}
            title={article.title}
            excerpt={article.excerpt}
            featuredImage={article.featuredImage}
            createdAt={article.createdAt ?? undefined}
          />
        ))}
      </div>
      <div ref={observe} className="h-px" aria-hidden="true" />
      {isError && (
        <p role="alert" className="text-muted-foreground">
          Artikel berikutnya belum dapat dimuat. Coba lagi.
        </p>
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage && <Spinner />}
            {isFetchingNextPage
              ? "Memuat artikel..."
              : isError
                ? "Coba lagi"
                : "Muat lebih banyak"}
          </Button>
        </div>
      )}
    </section>
  )
}
