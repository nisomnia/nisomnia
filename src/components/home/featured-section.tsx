"use client"

import { Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"
import { useCallback, useState } from "react"

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

const ARTICLES_PER_TOPIC = 1

function FeaturedCard({
  slug,
  variant,
}: {
  slug: string
  variant: "compact" | "spotlight"
}) {
  const {
    data: topic,
    isLoading: topicIsLoading,
    isError: topicIsError,
    refetch: refetchTopic,
  } = useTopicBySlug(slug)
  const {
    data,
    isLoading: articlesIsLoading,
    isError: articlesIsError,
    refetch,
  } = useArticlesByTopicId(topic?.id, ARTICLES_PER_TOPIC)

  if (topicIsLoading || articlesIsLoading) {
    return (
      <div role="status">
        <span className="sr-only">Memuat sorotan...</span>
        <ArticleRowSkeleton variant={variant} />
      </div>
    )
  }

  if (topicIsError || articlesIsError) {
    return (
      <div className="inline-status">
        <p role="alert">Sorotan belum dapat dimuat.</p>
        <Button
          variant="outline"
          onClick={() => (topicIsError ? refetchTopic() : refetch())}
        >
          Coba lagi
        </Button>
      </div>
    )
  }

  const article: ArticlesByTopicItem | undefined = data?.[0]?.article

  if (!article) return null

  return (
    <ArticleCard
      excerpt={article.excerpt}
      featuredImage={article.featuredImage}
      priority={variant === "spotlight"}
      slug={article.slug}
      title={article.title}
      variant={variant}
    />
  )
}

function DeferredFeaturedCards({ slugs }: { slugs: string[] }) {
  const [visible, setVisible] = useState(false)

  const observe = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || visible) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return
          setVisible(true)
          observer.disconnect()
        },
        { rootMargin: "0px 0px -25%" },
      )

      observer.observe(node)
      return () => observer.disconnect()
    },
    [visible],
  )

  return (
    <div ref={observe} className="article-list">
      {slugs.map((slug) =>
        visible ? (
          <FeaturedCard key={slug} slug={slug} variant="compact" />
        ) : (
          <ArticleRowSkeleton key={slug} />
        ),
      )}
    </div>
  )
}

export function FeaturedSection({ slugs }: { slugs: string[] }) {
  const lead = slugs[0]
  if (!lead) return null
  const rest = slugs.slice(1)

  return (
    <section aria-labelledby="featured-heading" className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 id="featured-heading" className="section-title">
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

      <div className="article-list">
        <FeaturedCard slug={lead} variant="spotlight" />
        <DeferredFeaturedCards slugs={rest} />
      </div>
    </section>
  )
}
