import { createFileRoute } from "@tanstack/react-router"

import { siteConfig } from "@/lib/seo/config"
import { fetchContentIndex } from "@/lib/seo/content-index"

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

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticUrls = [
          urlEntry(siteConfig.siteUrl),
          urlEntry(`${siteConfig.siteUrl}/topic`),
          urlEntry(`${siteConfig.siteUrl}/article`),
        ]

        const { topics, articles } = await fetchContentIndex()
        const topicUrls = topics.map((topic) =>
          urlEntry(
            `${siteConfig.siteUrl}/topic/${topic.slug}`,
            topic.updatedAt,
          ),
        )
        const articleUrls = articles.map((article) =>
          urlEntry(
            `${siteConfig.siteUrl}/article/${article.slug}`,
            article.updatedAt,
          ),
        )

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
