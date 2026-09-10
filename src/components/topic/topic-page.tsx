import { getRouteApi } from "@tanstack/react-router"

import { TopicArticles } from "@/components/topic/topic-articles"
import { TopicHeader } from "@/components/topic/topic-header"
import { useArticlesByTopicIdInfinite } from "@/hooks/api/article"
import { useTopicBySlug } from "@/hooks/api/topic"
const Route = getRouteApi("/topic/$slug/")
const PAGE_SIZE = 20

export function TopicPage() {
  const { slug } = Route.useParams()
  const {
    data: topic,
    isLoading: topicIsLoading,
    isError: topicIsError,
    refetch: refetchTopic,
  } = useTopicBySlug(slug)
  const {
    data: infiniteData,
    isLoading: articlesIsLoading,
    isError: articlesIsError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    isFetchNextPageError,
  } = useArticlesByTopicIdInfinite(topic?.id, PAGE_SIZE)

  const articles =
    infiniteData?.pages.flatMap((page) => page?.articles ?? []) ?? []

  return (
    <div className="page-shell">
      <TopicHeader
        topic={topic}
        isLoading={topicIsLoading}
        isError={topicIsError}
        slug={slug}
        retry={refetchTopic}
      />
      {topic && (
        <div>
          <TopicArticles
            articles={articles}
            isLoading={articlesIsLoading}
            isError={articlesIsError}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            retry={isFetchNextPageError ? fetchNextPage : refetch}
          />
        </div>
      )}
    </div>
  )
}
