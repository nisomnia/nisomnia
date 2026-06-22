import type { TopicResponse } from "@/hooks/api/topic"

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

export function buildTopicSeo(topic: NonNullable<TopicResponse>) {
  const url = `${siteConfig.siteUrl}/topic/${topic.slug}`
  const title = topic.metaTitle ?? topic.title
  const description = topic.metaDescription ?? topic.description ?? ""
  const seo = buildSeoMeta({
    title,
    description,
    url,
    type: "article",
    image: topic.featuredImage
      ? { url: topic.featuredImage, alt: topic.title }
      : undefined,
    canonical: url,
    hreflang: [{ lang: "id", href: url }],
  })
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.siteUrl },
    { name: "Topics", url: `${siteConfig.siteUrl}/topic` },
    { name: topic.title, url },
  ])
  return {
    ...seo,
    scripts: [
      jsonLdScript(
        buildGraph([
          placeJsonLd(),
          organizationJsonLd(),
          websiteJsonLd(),
          breadcrumb,
          collectionPageJsonLd({
            name: topic.title,
            url,
            description,
            breadcrumb,
          }),
        ]),
      ),
    ],
  }
}
