import type { ArticlesByTopicItem } from "@/hooks/api/article"

import {
  ArticleCard,
  ArticleRowSkeleton,
} from "@/components/article/article-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface TopicArticlesProps {
  articles: ArticlesByTopicItem[]
  isLoading: boolean
  isError: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  retry: () => void
}

export function TopicArticles({
  articles,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  retry,
}: TopicArticlesProps) {
  return (
    <div>
      {isLoading && (
        <div role="status" className="article-list">
          <span className="sr-only">Memuat artikel...</span>
          <ArticleRowSkeleton />
          <ArticleRowSkeleton />
          <ArticleRowSkeleton />
        </div>
      )}
      {isError && (
        <div className="inline-status">
          <p role="alert">Artikel belum dapat dimuat.</p>
          <Button variant="outline" onClick={retry}>
            Coba lagi
          </Button>
        </div>
      )}

      {!isLoading && !isError && articles.length === 0 && (
        <p className="inline-status">Belum ada artikel untuk topik ini.</p>
      )}

      <div className="article-list">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            excerpt={article.excerpt}
            featuredImage={article.featuredImage}
            priority={index === 0}
            slug={article.slug}
            title={article.title}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        {hasNextPage && !isError && (
          <Button disabled={isFetchingNextPage} onClick={fetchNextPage}>
            {isFetchingNextPage && <Spinner />}
            {isFetchingNextPage ? "Memuat artikel..." : "Muat lebih banyak"}
          </Button>
        )}
      </div>
    </div>
  )
}
