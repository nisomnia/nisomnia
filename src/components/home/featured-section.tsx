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

function FeaturedCard({
  slug,
  variant,
}: {
  slug: string
  variant: "compact" | "spotlight"
}) {
  const topicQuery = useTopicBySlug(slug)
  const articlesQuery = useArticlesByTopicId(
    topicQuery.data?.id,
    ARTICLES_PER_TOPIC,
  )

  if (topicQuery.isLoading || articlesQuery.isLoading) {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card">
        <Skeleton className="aspect-video w-full rounded-none" />
        <div className="space-y-2 p-5 sm:p-6">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    )
  }

  const article: ArticlesByTopicItem | undefined =
    articlesQuery.data?.[0]?.article

  if (!article) return null

  return (
    <ArticleCard
      excerpt={article.excerpt}
      featuredImage={article.featuredImage}
      priority={variant === "spotlight"}
      slug={article.slug}
      title={article.title}
      variant={variant}
      className="h-full"
    />
  )
}

export function FeaturedSection({ slugs }: { slugs: string[] }) {
  const lead = slugs[0]
  if (!lead) return null
  const rest = slugs.slice(1)

  return (
    <section aria-labelledby="featured-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="featured-heading" className="text-2xl font-bold tracking-tight">
          Sorotan
        </h2>
        <Button
          render={<Link to="/article" />}
          variant="outline"
          size="sm"
          className="gap-1 rounded-full"
        >
          Semua artikel
          <ArrowRightIcon />
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FeaturedCard slug={lead} variant="spotlight" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {rest.map((slug) => (
            <FeaturedCard key={slug} slug={slug} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  )
}
