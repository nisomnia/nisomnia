"use client"

import { Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"

import {
  ArticleCard,
  ArticleRowSkeleton,
} from "@/components/article/article-card"
import { Button } from "@/components/ui/button"
import {
  useArticlesByTopicId,
  type ArticlesByTopicItem,
} from "@/hooks/api/article"
import { useTopicBySlug } from "@/hooks/api/topic"

const ARTICLES_PER_TOPIC = 4

export function TopicSection({
  label,
  slug,
  startIndex = 0,
}: {
  label: string
  slug: string
  startIndex?: number
}) {
  const {
    data: topic,
    isLoading: topicIsLoading,
    isError: topicIsError,
  } = useTopicBySlug(slug)
  const {
    data,
    isLoading: articlesIsLoading,
    isError: articlesIsError,
  } = useArticlesByTopicId(topic?.id, ARTICLES_PER_TOPIC)
  const isLoading = topicIsLoading || articlesIsLoading
  const articles = data?.map((result) => result.article) ?? []

  return (
    <section aria-labelledby={`topic-${slug}`} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 id={`topic-${slug}`} className="section-title">
          {label}
        </h2>
        <Button
          render={<Link to="/topic/$slug" params={{ slug }} />}
          variant="outline"
          size="sm"
          className="gap-1 rounded-full"
        >
          Lihat Semua
          <ArrowRightIcon />
        </Button>
      </div>
      {(topicIsError || articlesIsError) && (
        <p role="alert" className="text-sm text-muted-foreground">
          Artikel belum dapat dimuat. Buka topik untuk mencoba lagi.
        </p>
      )}
      <div className="article-list">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <ArticleRowSkeleton key={index} />
            ))
          : articles
              .slice(startIndex, startIndex + ARTICLES_PER_TOPIC)
              .map((article: ArticlesByTopicItem) => (
                <ArticleCard
                  key={article.id}
                  excerpt={article.excerpt}
                  featuredImage={article.featuredImage}
                  slug={article.slug}
                  title={article.title}
                />
              ))}
      </div>
    </section>
  )
}
