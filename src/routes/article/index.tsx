import { createFileRoute } from "@tanstack/react-router"

import { ArticleListPage } from "@/components/article/article-list-page"
import { fetchArticlesByLanguageInfinite } from "@/hooks/api/article"
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

const PAGE_SIZE = 20

export const Route = createFileRoute("/article/")({
  validateSearch: (search) =>
    typeof search.q === "string" ? { q: search.q } : {},
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["articles", "by-language", "id", PAGE_SIZE] as const,
      queryFn: ({ pageParam }) =>
        fetchArticlesByLanguageInfinite(PAGE_SIZE, pageParam),
      initialPageParam: null as string | null,
    })
  },
  head: ({ match }) => {
    const q = match.search.q?.trim()
    const url = `${siteConfig.siteUrl}/article`
    const isSearching = Boolean(q)
    const seo = buildSeoMeta({
      title: q
        ? `Search: ${q} - ${siteConfig.siteName}`
        : `Articles - ${siteConfig.siteName}`,
      description: q
        ? `Search results for "${q}" on ${siteConfig.siteName}`
        : `Read all articles on ${siteConfig.siteName}`,
      url,
      canonical: url,
      noindex: isSearching,
    })
    const breadcrumb = breadcrumbJsonLd([
      { name: "Home", url: siteConfig.siteUrl },
      { name: "Articles", url },
    ])
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: isSearching
        ? []
        : [
            jsonLdScript(
              buildGraph([
                placeJsonLd(),
                organizationJsonLd(),
                websiteJsonLd(),
                breadcrumb,
                collectionPageJsonLd({
                  name: "Articles",
                  url,
                  description: `Read all articles on ${siteConfig.siteName}`,
                  breadcrumb,
                }),
              ]),
            ),
          ],
    }
  },
  component: ArticleListPage,
})
