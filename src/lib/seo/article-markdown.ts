import { parse } from "node-html-parser"

import type { operations } from "@/lib/api/types"

import { siteConfig } from "@/lib/seo/config"

type Article = NonNullable<
  operations["articleBySlug"]["responses"][200]["content"]["application/json"]
>

export function buildArticleMarkdown(article: Article): string {
  const url = `${siteConfig.siteUrl}/article/${article.slug}`
  const summary = (article.metaDescription ?? article.excerpt).trim()
  const author = article.authors[0]
  const authorName = author?.name ?? author?.username
  const details = [
    authorName ? `- Penulis: ${authorName}` : undefined,
    article.topics.length > 0
      ? `- Topik: ${article.topics.map(({ title }) => title).join(", ")}`
      : undefined,
    article.createdAt ? `- Diterbitkan: ${article.createdAt}` : undefined,
    article.updatedAt ? `- Diperbarui: ${article.updatedAt}` : undefined,
  ].filter((detail): detail is string => detail !== undefined)
  const content = parse(article.content).structuredText.trim()

  return [
    `# ${article.title}`,
    summary ? `> ${summary}` : "",
    details.join("\n"),
    content,
    `[Baca versi web](${url})`,
  ]
    .filter(Boolean)
    .join("\n\n")
}
