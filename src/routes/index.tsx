import { Link, createFileRoute } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"

import { FeaturedSection } from "@/components/home/featured-section"
import { HOME_TOPICS, TopicPills } from "@/components/home/topic-pills"
import { TopicSection } from "@/components/topic/topic-section"
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
const ARTICLES_PER_TOPIC = 4

export const Route = createFileRoute("/")({
  ssr: true,
  loader: async ({ context: { queryClient } }) => {
    const topics = await Promise.all(
      HOME_TOPICS.map(({ slug }) =>
        queryClient.fetchQuery({
          queryKey: ["topic", "by-slug", slug],
          queryFn: async () => {
            const { data, error } = await fetchClient.GET(
              "/topic/by-slug/{slug}",
              {
                params: { path: { slug } },
              },
            )
            if (error) throw error
            if (!data) throw new Error(`Topic not found: ${slug}`)
            return data
          },
          staleTime: 5 * 60 * 1000,
        }),
      ),
    )

    await Promise.all(
      topics.map((topic) =>
        queryClient.fetchQuery({
          queryKey: [
            "articles",
            "by-topic-id",
            topic.id,
            DEFAULT_LANGUAGE,
            ARTICLES_PER_TOPIC,
          ],
          queryFn: async () => {
            const { data, error } = await fetchClient.POST(
              "/article/by-topic-id",
              {
                body: {
                  topicId: topic.id,
                  language: DEFAULT_LANGUAGE,
                  page: 1,
                  perPage: ARTICLES_PER_TOPIC,
                },
              },
            )
            if (error) throw error
            return data ?? []
          },
          staleTime: 5 * 60 * 1000,
        }),
      ),
    )
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

      {HOME_TOPICS.map(({ label, slug }) => (
        <TopicSection key={slug} label={label} slug={slug} startIndex={1} />
      ))}

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
