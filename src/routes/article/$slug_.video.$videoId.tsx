import { createFileRoute, notFound } from "@tanstack/react-router"

import { VideoWatchPage } from "@/components/article/video-watch-page"
import { fetchClient } from "@/lib/api/client"
import { extractYouTubeIds, fetchAllVideoMeta } from "@/lib/article/youtube"
import { buildVideoSeo } from "@/lib/seo/article-head"

export const Route = createFileRoute("/article/$slug_/video/$videoId")({
  loader: async ({ params, context: { queryClient } }) => {
    const { slug, videoId } = params
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

    if (!article || !extractYouTubeIds(article.content).includes(videoId)) {
      throw notFound()
    }

    const [video] = await fetchAllVideoMeta({ data: [videoId] })
    const uploadDate = video?.uploadDate ?? article.createdAt

    if (!video || !uploadDate || Number.isNaN(Date.parse(uploadDate))) {
      throw notFound()
    }

    return { article, video, uploadDate }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Video" }], links: [], scripts: [] }
    }
    return buildVideoSeo(
      loaderData.article,
      loaderData.video,
      loaderData.uploadDate,
    )
  },
  component: VideoWatchPage,
})
