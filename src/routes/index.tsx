import { Link, createFileRoute } from "@tanstack/react-router"

import { TopicSection } from "@/components/topic/topic-section"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/seo/config"
import {
  articleJsonLd,
  buildGraph,
  jsonLdScript,
  organizationJsonLd,
  placeJsonLd,
  websiteJsonLd,
  webpageJsonLd,
} from "@/lib/seo/json-ld"
import { buildSeoMeta } from "@/lib/seo/meta"

export const Route = createFileRoute("/")({
  ssr: "data-only",
  head: () => {
    const url = siteConfig.siteUrl
    const seo = buildSeoMeta({
      title: siteConfig.siteName,
      description: siteConfig.siteDescription,
      url,
      canonical: url,
    })
    return {
      ...seo,
      scripts: [
        jsonLdScript(
          buildGraph([
            placeJsonLd(),
            organizationJsonLd(),
            websiteJsonLd(),
            webpageJsonLd({
              name: siteConfig.siteName,
              url,
              description: siteConfig.siteDescription,
            }),
            articleJsonLd({
              headline: siteConfig.siteName,
              description: siteConfig.siteDescription,
              url,
            }),
          ]),
        ),
      ],
    }
  },
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

      <div className="flex justify-center pt-4">
        <Button render={<Link to="/article" />}>Lihat semua artikel</Button>
      </div>
    </div>
  )
}
