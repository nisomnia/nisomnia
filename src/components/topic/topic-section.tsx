"use client"

import { Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"

import { ArticleCard } from "@/components/article/article-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
  const topicQuery = useTopicBySlug(slug)
  const topicId = topicQuery.data?.id
  const articlesQuery = useArticlesByTopicId(topicId, ARTICLES_PER_TOPIC)

  const isLoading = topicQuery.isLoading || articlesQuery.isLoading
  const articles = articlesQuery.data?.flatMap((r) => [r.article]) ?? []

  return (
    <section aria-labelledby={`topic-${slug}`} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id={`topic-${slug}`} className="text-2xl font-bold tracking-tight">
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col overflow-hidden rounded-xl border bg-card"
              >
                <Skeleton className="aspect-video w-full rounded-none" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-3/5" />
                </div>
              </div>
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
