import { createFileRoute } from "@tanstack/react-router"

import { fetchClient } from "@/lib/api/client"
import { siteConfig } from "@/lib/seo/config"

interface SitemapEntry {
  slug: string
  updatedAt: string | null
}

const PER_PAGE = 100

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function urlEntry(loc: string, lastmod?: string | null): string {
  const mod = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>${mod}\n  </url>`
}

async function fetchAllSitemapEntries(
  op: "/article/sitemap" | "/topic/sitemap",
  language: "id" | "en",
): Promise<SitemapEntry[]> {
  const all: SitemapEntry[] = []
  let page = 1

  while (true) {
    const { data, error } = await fetchClient.POST(op, {
      body: { page, perPage: PER_PAGE, language },
    })
    if (error) throw error
    const batch = (data as SitemapEntry[]) ?? []
    all.push(...batch)
    if (batch.length < PER_PAGE) break
    page += 1
  }

  return all
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticUrls = [
          urlEntry(siteConfig.siteUrl),
          urlEntry(`${siteConfig.siteUrl}/topic`),
          urlEntry(`${siteConfig.siteUrl}/article`),
        ]

        const topicUrls: string[] = []
        const articleUrls: string[] = []

        for (const language of ["id", "en"] as const) {
          const topics = await fetchAllSitemapEntries(
            "/topic/sitemap",
            language,
          )
          topicUrls.push(
            ...topics.map((t) =>
              urlEntry(`${siteConfig.siteUrl}/topic/${t.slug}`, t.updatedAt),
            ),
          )

          const articles = await fetchAllSitemapEntries(
            "/article/sitemap",
            language,
          )
          articleUrls.push(
            ...articles.map((a) =>
              urlEntry(`${siteConfig.siteUrl}/article/${a.slug}`, a.updatedAt),
            ),
          )
        }

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...topicUrls, ...articleUrls].join("\n")}
</urlset>`

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        })
      },
    },
  },
})
