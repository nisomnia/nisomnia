import { Link } from "@tanstack/react-router"

import type { operations } from "@/lib/api/types"

import { Button } from "@/components/ui/button"

type Topic =
  operations["topicByArticleCount"]["responses"][200]["content"]["application/json"][number]

export function TopicsList({ topics }: { topics: Topic[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {topics.map((topic) => (
        <Button
          key={topic.id}
          render={<Link params={{ slug: topic.slug }} to="/topic/$slug" />}
          variant="outline"
          size="lg"
          className="h-auto min-h-18 justify-start px-5 py-4 text-left text-base font-normal"
        >
          <span className="line-clamp-2">{topic.title}</span>
        </Button>
      ))}
    </div>
  )
}
