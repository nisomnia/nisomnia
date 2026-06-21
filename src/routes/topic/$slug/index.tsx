import { createFileRoute } from "@tanstack/react-router"

import { TopicArticles } from "@/components/topic/topic-articles"
import { TopicHeader } from "@/components/topic/topic-header"
import {
  prefetchArticlesByTopicId,
  useArticlesByTopicIdInfinite,
} from "@/hooks/api/article"
import { fetchTopicBySlug, useTopicBySlug } from "@/hooks/api/topic"
import { buildTopicSeo } from "@/lib/seo/topic-head"

const PAGE_SIZE = 20

export const Route = createFileRoute("/topic/$slug/")({
  loader: async ({ params, context: { queryClient } }) => {
    const topic = await fetchTopicBySlug(params.slug)
    if (topic) {
      await prefetchArticlesByTopicId(queryClient, topic.id, PAGE_SIZE)
    }
    return topic
  },
  head: ({ loaderData: topic }) =>
    topic
      ? buildTopicSeo(topic)
      : { title: "Topic not found", meta: [], links: [] },
  component: TopicPage,
})

function TopicPage() {
  const { slug } = Route.useParams()
  const {
    data: topic,
    isLoading: topicIsLoading,
    isError: topicIsError,
  } = useTopicBySlug(slug)
  const {
    data: infiniteData,
    isLoading: articlesIsLoading,
    isError: articlesIsError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useArticlesByTopicIdInfinite(topic?.id, PAGE_SIZE)

  const articles =
    infiniteData?.pages.flatMap((page) => page?.articles ?? []) ?? []

  return (
    <div>
      <TopicHeader
        topic={topic}
        isLoading={topicIsLoading}
        isError={topicIsError}
        slug={slug}
      />
      {topic && (
        <div className="mx-auto max-w-3xl p-8">
          <TopicArticles
            articles={articles}
            isLoading={articlesIsLoading}
            isError={articlesIsError}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      )}
    </div>
  )
}
