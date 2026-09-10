import { createFileRoute } from "@tanstack/react-router"

import { TopicsPage } from "@/components/topic/topics-page"
import { prefetchTopicsByArticleCount } from "@/hooks/api/topic"
import { siteConfig } from "@/lib/seo/config"
import {
  breadcrumbJsonLd,
  buildGraph,
  collectionPageJsonLd,
  jsonLdScript,
  organizationJsonLd,
  placeJsonLd,
  websiteJsonLd,
} from "@/lib/seo/json-ld"
import { buildSeoMeta } from "@/lib/seo/meta"

const PER_PAGE = 100

export const Route = createFileRoute("/topic/")({
  ssr: "data-only",
  loader: async ({ context: { queryClient } }) => {
    await prefetchTopicsByArticleCount(queryClient, {
      page: 1,
      perPage: PER_PAGE,
    })
  },
  head: () => {
    const url = `${siteConfig.siteUrl}/topic`
    const seo = buildSeoMeta({
      title: "Topics - Nisomnia",
      description: "Browse all topics available on Nisomnia.",
      url,
      canonical: url,
      image: {
        url: `${siteConfig.siteUrl}/images/cover.png`,
        alt: "Nisomnia topics",
      },
      hreflang: [{ lang: "id", href: url }],
    })
    const breadcrumb = breadcrumbJsonLd([
      { name: "Home", url: siteConfig.siteUrl },
      { name: "Topics", url },
    ])
    const graph = buildGraph([
      placeJsonLd(),
      organizationJsonLd(),
      websiteJsonLd(),
      breadcrumb,
      collectionPageJsonLd({
        name: "Topics",
        url,
        description: "Browse all topics available on Nisomnia.",
        breadcrumb,
      }),
    ])
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [jsonLdScript(graph)],
    }
  },
  component: TopicsPage,
})
