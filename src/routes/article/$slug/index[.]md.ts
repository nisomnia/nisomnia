import { createFileRoute } from "@tanstack/react-router"

import { fetchClient } from "@/lib/api/client"
import { buildArticleMarkdown } from "@/lib/seo/article-markdown"

export const Route = createFileRoute("/article/$slug/index.md")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { data: article, error } = await fetchClient.GET(
          "/article/by-slug/{slug}",
          { params: { path: { slug: params.slug } } },
        )
        if (error) throw error
        if (!article) return new Response("Article not found", { status: 404 })

        return new Response(buildArticleMarkdown(article), {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
            Link: `</article/${article.slug}>; rel="canonical", </llms.txt>; rel="describedby"`,
          },
        })
      },
    },
  },
})
