import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { ChevronRightIcon } from "lucide-react"

import type { operations } from "@/api/types"

import { fetchClient } from "@/api/client"
import { ArticleCard } from "@/components/route/article-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const LANGUAGE = "id"
const ARTICLES_PER_TOPIC = 5

type ArticleResponse =
  operations["articleByTopicId"]["responses"][200]["content"]["application/json"]
type ArticleItem = ArticleResponse[number]["article"]

function useTopicBySlug(slug: string) {
  return useQuery({
    queryKey: ["topic", "by-slug", slug],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/topic/by-slug/{slug}", {
        params: { path: { slug } },
      })
      if (error) throw error
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}

function useArticlesByTopicId(topicId: string | undefined) {
  return useQuery({
    enabled: Boolean(topicId),
    queryKey: [
      "articles",
      "by-topic-id",
      topicId,
      LANGUAGE,
      ARTICLES_PER_TOPIC,
    ],
    queryFn: async () => {
      const { data, error } = await fetchClient.POST("/article/by-topic-id", {
        body: {
          topicId: topicId!,
          language: LANGUAGE,
          page: 1,
          perPage: ARTICLES_PER_TOPIC,
        },
      })
      if (error) throw error
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function TopicSection({ label, slug }: { label: string; slug: string }) {
  const topicQuery = useTopicBySlug(slug)
  const topicId = topicQuery.data?.id
  const articlesQuery = useArticlesByTopicId(topicId)

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading ? (
          <div className="col-span-full flex h-64 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          articles
            .slice(0, ARTICLES_PER_TOPIC)
            .map((article: ArticleItem) => (
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
