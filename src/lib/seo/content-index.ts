import type { operations } from "@/lib/api/types"

import { fetchClient } from "@/lib/api/client"
import { siteConfig } from "@/lib/seo/config"

type ContentIndexEntry =
  operations["articleSitemap"]["responses"][200]["content"]["application/json"][number]

type ContentIndexOperation = "/article/sitemap" | "/topic/sitemap"

const PER_PAGE = 100

async function fetchAllContentIndexEntries(
  operation: ContentIndexOperation,
): Promise<ContentIndexEntry[]> {
  const entries: ContentIndexEntry[] = []
  let page = 1

  while (true) {
    const { data, error } = await fetchClient.POST(operation, {
      body: { page, perPage: PER_PAGE, language: "id" },
    })
    if (error) throw error

    const batch = data ?? []
    entries.push(...batch)
    if (batch.length < PER_PAGE) return entries
    page += 1
  }
}

export async function fetchContentIndex() {
  const [topics, articles] = await Promise.all([
    fetchAllContentIndexEntries("/topic/sitemap"),
    fetchAllContentIndexEntries("/article/sitemap"),
  ])
  return { topics, articles }
}

function titleFromSlug(slug: string): string {
  return slug
    .replaceAll("-", " ")
    .replace(/\b\p{L}/gu, (character) => character.toUpperCase())
}

function contentLinks(
  path: "article" | "topic",
  entries: ContentIndexEntry[],
): string[] {
  const slugs = [...new Set(entries.map(({ slug }) => slug))].sort()
  return slugs.map((slug) => {
    const suffix = path === "article" ? "/index.md" : ""
    return `- [${titleFromSlug(slug)}](${siteConfig.siteUrl}/${path}/${slug}${suffix})`
  })
}

export function buildLlmsText({
  topics,
  articles,
}: {
  topics: ContentIndexEntry[]
  articles: ContentIndexEntry[]
}): string {
  return `# ${siteConfig.siteName}

> Media pop culture Indonesia tentang geek culture, game, anime, manga, film, musik, televisi, komik, dan topik anti-mainstream.

Nisomnia menerbitkan artikel dalam bahasa Indonesia.

## Jelajahi

- [Semua topik](${siteConfig.siteUrl}/topic): Daftar topik Nisomnia
- [Semua artikel](${siteConfig.siteUrl}/article): Artikel terbaru Nisomnia

## Topik

${contentLinks("topic", topics).join("\n")}

## Artikel

${contentLinks("article", articles).join("\n")}
`
}
