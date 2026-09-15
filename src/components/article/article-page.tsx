import { getRouteApi } from "@tanstack/react-router"

import { ArticleLayout } from "@/components/article/article-layout"
import { ArticleNotFound } from "@/components/article/article-not-found"
const Route = getRouteApi("/article/$slug")

export function ArticlePage() {
  const { slug } = Route.useParams()
  const data = Route.useLoaderData()

  if (!data?.article) {
    return <ArticleNotFound slug={slug} />
  }

  return (
    <ArticleLayout
      article={data.article}
      slug={slug}
      videoMeta={data.videoMeta}
    />
  )
}
