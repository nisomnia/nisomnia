import { createFileRoute } from "@tanstack/react-router"

import type { ArticleResponse } from "@/hooks/api/article"

import { ArticleLayout } from "@/components/article/article-layout"
import { ArticleNotFound } from "@/components/article/article-not-found"
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
        return data as ArticleResponse
      },
    })

    const videoIds = extractYouTubeIds(article?.content ?? "")
    const videoMeta = await fetchAllVideoMeta(videoIds)

    return { article, videoMeta }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.article) {
      return { title: "Article", meta: [], links: [], scripts: [] }
    }
    return buildArticleSeo(loaderData.article, loaderData.videoMeta)
  },
  component: ArticlePage,
})

function ArticlePage() {
  const { slug } = Route.useParams()
  const data = Route.useLoaderData()

  if (!data?.article) {
    return <ArticleNotFound slug={slug} />
  }

  return <ArticleLayout article={data.article} slug={slug} />
}
