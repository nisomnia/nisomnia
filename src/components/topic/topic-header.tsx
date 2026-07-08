import type { TopicResponse } from "@/hooks/api/topic"

interface TopicHeaderProps {
  topic: TopicResponse | undefined
  isLoading: boolean
  isError: boolean
  slug: string
}

export function TopicHeader({
  topic,
  isLoading,
  isError,
  slug,
}: TopicHeaderProps) {
  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (isError || !topic) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <h1 className="text-2xl font-semibold">Topic not found</h1>
        <p className="mt-2 text-muted-foreground">
          We could not find a topic for &ldquo;{slug}&rdquo;.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">{topic.title}</h1>
    </div>
  )
}
