import type { ArticlesByTopicItem } from "@/hooks/api/article"

import { ArticleCard } from "@/components/article/article-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface TopicArticlesProps {
  articles: ArticlesByTopicItem[]
  isLoading: boolean
  isError: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}

export function TopicArticles({
  articles,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: TopicArticlesProps) {
  return (
    <div className="space-y-6">
      {isError && (
        <p className="text-destructive" role="alert">
          Failed to load articles.
        </p>
      )}

      {!isLoading && !isError && articles.length === 0 && (
        <p className="text-muted-foreground">No articles found.</p>
      )}

      <div className="space-y-6">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            excerpt={article.excerpt}
            featuredImage={article.featuredImage}
            priority={index === 0}
            slug={article.slug}
            title={article.title}
            titleClassName="sm:text-xl md:text-2xl lg:text-4xl"
            excerptClassName="sm:text-sm md:text-base lg:text-xl lg:line-clamp-none"
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        {hasNextPage && (
          <Button disabled={isFetchingNextPage} onClick={fetchNextPage}>
            {isFetchingNextPage && <Spinner />}
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        )}
      </div>
    </div>
  )
}
