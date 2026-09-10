import { createFileRoute } from "@tanstack/react-router"

import { ArticlePage } from "@/components/article/article-page"
import { fetchClient } from "@/lib/api/client"
import { extractYouTubeIds, fetchAllVideoMeta } from "@/lib/article/youtube"
import { buildArticleSeo } from "@/lib/seo/article-head"

export const Route = createFileRoute("/article/$slug")({
  loader: async ({ params, context: { queryClient } }) => {
    const { slug } = params
    const article = await queryClient.fetchQuery({
      queryKey: ["article", "by-slug", slug],
      queryFn: async () => {
        const { data, error } = await fetchClient.GET(
          "/article/by-slug/{slug}",
          {
            params: { path: { slug } },
          },
        )
        if (error) throw error
        return data
      },
    })

    const videoIds = extractYouTubeIds(article?.content ?? "")
    const videoMeta = await fetchAllVideoMeta(videoIds)

    return { article, videoMeta }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.article) {
      return { meta: [{ title: "Article" }], links: [], scripts: [] }
    }
    return buildArticleSeo(loaderData.article, loaderData.videoMeta)
  },
  component: ArticlePage,
})
