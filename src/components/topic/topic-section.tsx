import { Link } from "@tanstack/react-router"
import { ChevronRightIcon } from "lucide-react"

import { ArticleCard } from "@/components/article/article-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  useArticlesByTopicId,
  type ArticlesByTopicItem,
} from "@/hooks/api/article"
import { useTopicBySlug } from "@/hooks/api/topic"

const ARTICLES_PER_TOPIC = 4

export function TopicSection({ label, slug }: { label: string; slug: string }) {
  const topicQuery = useTopicBySlug(slug)
  const topicId = topicQuery.data?.id
  const articlesQuery = useArticlesByTopicId(topicId, ARTICLES_PER_TOPIC)

  const isLoading = topicQuery.isLoading || articlesQuery.isLoading
  const articles = articlesQuery.data?.flatMap((r) => [r.article]) ?? []

  return (
    <section className="space-y-4">
      {!isLoading && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{label}</h2>
          <Button
            render={<Link to="/topic/$slug" params={{ slug }} />}
            variant="ghost"
            size="sm"
            className="gap-1"
          >
            Lihat Semua
            <ChevronRightIcon />
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <div className="col-span-full flex h-64 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          articles
            .slice(0, ARTICLES_PER_TOPIC)
            .map((article: ArticlesByTopicItem) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                slug={article.slug}
                featuredImage={article.featuredImage}
                excerpt={article.excerpt}
              />
            ))
        )}
      </div>
    </section>
  )
}
