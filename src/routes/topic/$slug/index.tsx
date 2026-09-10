import { createFileRoute } from "@tanstack/react-router"

import { TopicPage } from "@/components/topic/topic-page"
import { prefetchArticlesByTopicId } from "@/hooks/api/article"
import { fetchTopicBySlug } from "@/hooks/api/topic"
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
      : { meta: [{ title: "Topic not found" }], links: [] },
  component: TopicPage,
})
