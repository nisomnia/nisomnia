import { Link } from "@tanstack/react-router"
import { ArrowUpRightIcon, HashIcon } from "lucide-react"

import type { operations } from "@/lib/api/types"

type Topic =
  operations["topicByArticleCount"]["responses"][200]["content"]["application/json"][number]

export function TopicsList({ topics }: { topics: Topic[] }) {
  return (
    <ul className="grid gap-x-10 sm:grid-cols-2">
      {topics.map((topic) => (
        <li key={topic.id} className="border-b">
          <Link
            params={{ slug: topic.slug }}
            to="/topic/$slug"
            className="topic-link"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted">
              <HashIcon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 wrap-break-word">
              {topic.title}
            </span>
            <ArrowUpRightIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}
