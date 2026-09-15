import { describe, expect, it } from "vitest"

import { buildArticleMarkdown } from "@/lib/seo/article-markdown"
import { buildLlmsText } from "@/lib/seo/content-index"

describe("buildLlmsText", () => {
  it("builds a deduplicated LLM content index", () => {
    const text = buildLlmsText({
      topics: [
        { slug: "anime", updatedAt: null },
        { slug: "anime", updatedAt: "2026-01-01" },
      ],
      articles: [
        { slug: "berita-game-terbaru", updatedAt: null },
        { slug: "ada-apa-hari-ini", updatedAt: null },
      ],
    })

    expect(text).toContain("# Nisomnia")
    expect(text).toContain("## Topik")
    expect(text).toContain(
      "[Berita Game Terbaru](https://nisomnia.com/article/berita-game-terbaru/index.md)",
    )
    expect(text.match(/nisomnia\.com\/topic\/anime/g)).toHaveLength(1)
    expect(text.indexOf("Ada Apa Hari Ini")).toBeLessThan(
      text.indexOf("Berita Game Terbaru"),
    )
  })

  it("builds clean Markdown from an Indonesian article", () => {
    const text = buildArticleMarkdown({
      id: "article-id",
      language: "id",
      title: "Judul Artikel",
      slug: "judul-artikel",
      content: "<h2>Jawaban singkat</h2><p>Isi <strong>penting</strong>.</p>",
      excerpt: "Ringkasan artikel.",
      metaTitle: null,
      metaDescription: null,
      status: "published",
      visibility: "public",
      articleTranslationId: "translation-id",
      featuredImage: "",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-02",
      topics: [{ id: "topic-id", title: "Anime", slug: "anime" }],
      authors: [{ id: "author-id", name: "Nisomnia", username: "nisomnia" }],
      editors: [],
    })

    expect(text).toContain("# Judul Artikel")
    expect(text).toContain("> Ringkasan artikel.")
    expect(text).toContain("Jawaban singkat\nIsi penting.")
    expect(text).not.toContain("<strong>")
    expect(text).toContain(
      "[Baca versi web](https://nisomnia.com/article/judul-artikel)",
    )
  })
})
