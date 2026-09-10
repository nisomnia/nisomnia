import { Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"

import { DeferredTopicSections } from "@/components/home/deferred-topic-sections"
import { FeaturedSection } from "@/components/home/featured-section"
import { HOME_TOPICS, TopicPills } from "@/components/home/topic-pills"
import { Button } from "@/components/ui/button"

export function Home() {
  const slugs = HOME_TOPICS.map(({ slug }) => slug)

  return (
    <div className="page-shell flex flex-col gap-14 sm:gap-20">
      <div className="page-heading mb-0">
        <p className="eyebrow">Nisomnia</p>
        <h1>Media pop culture niatnya.</h1>
        <p>Anime, game, manga, film, dan teknologi. Temukan bacaan lainnya.</p>
      </div>
      <TopicPills />

      <FeaturedSection slugs={slugs} />

      <DeferredTopicSections topics={HOME_TOPICS} />

      <div className="flex justify-center pt-2">
        <Button
          render={<Link to="/article" />}
          size="lg"
          className="gap-1.5 rounded-full px-8"
        >
          Lihat semua artikel
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  )
}
