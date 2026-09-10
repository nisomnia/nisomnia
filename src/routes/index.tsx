import { createFileRoute } from "@tanstack/react-router"

import { Home } from "@/components/home/home-page"
import { HOME_TOPICS } from "@/components/home/topic-pills"
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
