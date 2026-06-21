import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"

import { fetchClient } from "@/api/client"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/topic/$slug/")({
  component: TopicPage,
  head: () => ({
    title: "Topic",
    meta: [{ name: "description", content: "Browse articles by topic" }],
  }),
})

function TopicPage() {
  const { slug } = Route.useParams()

  const {
    data: topic,
    isLoading: topicIsLoading,
    isError: topicIsError,
  } = useQuery({
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

  if (topicIsLoading) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <div className="bg-muted h-8 w-48 animate-pulse rounded" />
      </div>
    )
  }

  if (topicIsError || !topic) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <h1 className="text-2xl font-semibold">Topic not found</h1>
        <p className="text-muted-foreground mt-2">
          We could not find a topic for “{slug}”.
        </p>
        <Button className="mt-6" render={<Link to="/" />}>
          Go home
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-4xl font-bold">{topic.title}</h1>
      {topic.description && (
        <p className="text-muted-foreground mt-4 text-lg">
          {topic.description}
        </p>
      )}
      <div className="mt-8">
        <Button render={<Link to="/article" />} variant="outline">
          Browse articles
        </Button>
      </div>
    </div>
  )
}
