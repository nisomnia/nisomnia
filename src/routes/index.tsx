import { createFileRoute } from "@tanstack/react-router"

import { TopicSection } from "@/components/route/topic-section"

export const Route = createFileRoute("/")({
  ssr: "data-only",
  component: Home,
})

const TOPIC_SLUGS = [
  { label: "Anime", slug: "anime" },
  { label: "Game", slug: "game" },
  { label: "Manga", slug: "manga" },
  { label: "Film", slug: "film" },
  { label: "Teknologi", slug: "teknologi" },
]

function Home() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      {TOPIC_SLUGS.map(({ label, slug }) => (
        <TopicSection key={slug} label={label} slug={slug} />
      ))}
    </div>
  )
}
