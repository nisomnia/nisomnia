import { Link, createFileRoute } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"

import { DeferredTopicSections } from "@/components/home/deferred-topic-sections"
import { FeaturedSection } from "@/components/home/featured-section"
import { HOME_TOPICS, TopicPills } from "@/components/home/topic-pills"
import { Button } from "@/components/ui/button"
import { fetchClient } from "@/lib/api/client"
import { siteConfig } from "@/lib/seo/config"
import {
  buildGraph,
  collectionPageJsonLd,
  jsonLdScript,
  organizationJsonLd,
  placeJsonLd,
  websiteJsonLd,
  webpageJsonLd,
} from "@/lib/seo/json-ld"
import { buildSeoMeta } from "@/lib/seo/meta"

const DEFAULT_LANGUAGE = "id"
const FEATURED_ARTICLES = 1

export const Route = createFileRoute("/")({
  ssr: true,
  loader: async ({ context: { queryClient } }) => {
    const { slug } = HOME_TOPICS[0]
    const topic = await queryClient.fetchQuery({
      queryKey: ["topic", "by-slug", slug],
      queryFn: async () => {
        const { data, error } = await fetchClient.GET("/topic/by-slug/{slug}", {
          params: { path: { slug } },
        })
        if (error) throw error
        if (!data) throw new Error(`Topic not found: ${slug}`)
        return data
      },
      staleTime: 5 * 60 * 1000,
    })

    await queryClient.fetchQuery({
      queryKey: [
        "articles",
        "by-topic-id",
        topic.id,
        DEFAULT_LANGUAGE,
        FEATURED_ARTICLES,
      ],
      queryFn: async () => {
        const { data, error } = await fetchClient.POST("/article/by-topic-id", {
          body: {
            topicId: topic.id,
            language: DEFAULT_LANGUAGE,
            page: 1,
            perPage: FEATURED_ARTICLES,
          },
        })
        if (error) throw error
        return data ?? []
      },
      staleTime: 5 * 60 * 1000,
    })
  },
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
            collectionPageJsonLd({
              name: siteConfig.siteName,
              url,
              description: siteConfig.siteDescription,
            }),
          ]),
        ),
      ],
    }
  },
  component: Home,
})

function Home() {
  const slugs = HOME_TOPICS.map(({ slug }) => slug)

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 lg:px-8">
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
