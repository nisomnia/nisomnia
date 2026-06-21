"use client"

import { createFileRoute } from "@tanstack/react-router"

import { TopicsList } from "@/components/topic/topics-list"
import { Spinner } from "@/components/ui/spinner"
import {
  prefetchTopicsByArticleCount,
  useTopicsByArticleCount,
} from "@/hooks/api/topic"

const PER_PAGE = 100

export const Route = createFileRoute("/topic/")({
  loader: async ({ context: { queryClient } }) => {
    await prefetchTopicsByArticleCount(queryClient, {
      page: 1,
      perPage: PER_PAGE,
    })
  },
  ssr: "data-only",
  component: TopicsPage,
})

function TopicsPage() {
  const {
    data: topics,
    isLoading,
    isError,
  } = useTopicsByArticleCount({
    page: 1,
    perPage: PER_PAGE,
  })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-destructive">Failed to load topics.</p>
      </div>
    )
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-muted-foreground">No topics found.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Topics</h1>
        <p className="text-muted-foreground">
          Browse all {topics.length} topics.
        </p>
      </div>

      <TopicsList topics={topics} />
    </div>
  )
}
