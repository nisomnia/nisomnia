import type { ArticleResponse } from "@/hooks/api/article"
import type { VideoMeta } from "@/lib/article/types"

import { extractYouTubeIds } from "@/lib/article/youtube"
import { siteConfig } from "@/lib/seo/config"
import {
  breadcrumbJsonLd,
  buildGraph,
  imageObjectJsonLd,
  jsonLdScript,
  newsArticleJsonLd,
  organizationJsonLd,
  placeJsonLd,
  videoObjectJsonLd,
  websiteJsonLd,
  webpageJsonLd,
} from "@/lib/seo/json-ld"
import { buildSeoMeta } from "@/lib/seo/meta"

export function buildArticleSeo(
  article: NonNullable<ArticleResponse>,
  videoMeta: VideoMeta[],
) {
  const url = `${siteConfig.siteUrl}/article/${article.slug}`
  const title = article.metaTitle ?? article.title
  const description = article.metaDescription ?? article.excerpt ?? ""
  const primaryTopic = article.topics[0]
  const authorName = article.authors[0]?.name ?? article.authors[0]?.username
  const seo = buildSeoMeta({
    title,
    description,
    url,
    type: "article",
    image: {
      url: article.featuredImage ?? `${siteConfig.siteUrl}/images/cover.png`,
      alt: article.title,
    },
    publishedTime: article.createdAt,
    modifiedTime: article.updatedAt,
    section: primaryTopic?.title,
    tags: article.topics.map((t) => t.title),
    canonical: url,
  })
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.siteUrl },
    ...(primaryTopic
      ? [
          {
            name: primaryTopic.title,
            url: `${siteConfig.siteUrl}/topic/${primaryTopic.slug}`,
          },
        ]
      : []),
    { name: article.title, url },
  ])
  const videoIds = extractYouTubeIds(article.content)
  const webpage = webpageJsonLd({
    name: article.title,
    url,
    description,
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    imageUrl: article.featuredImage ?? "/images/cover.png",
    breadcrumb,
  })
  const videos = videoIds.map((videoId) => {
    const meta = videoMeta.find((v) => v.videoId === videoId)
    return videoObjectJsonLd({
      name: meta?.title ?? article.title,
      description: meta?.description ?? description,
      videoId,
      uploadDate: meta?.uploadDate ?? article.createdAt,
      thumbnailUrl: meta?.thumbnailUrl,
      duration: meta?.duration ?? undefined,
      width: meta?.width,
      height: meta?.height,
      isPartOf: webpage,
    })
  })
  return {
    ...seo,
    scripts: [
      jsonLdScript(
        buildGraph([
          placeJsonLd(),
          organizationJsonLd(),
          websiteJsonLd(),
          ...(article.featuredImage
            ? [
                imageObjectJsonLd({
                  url: article.featuredImage,
                  caption: article.title,
                }),
              ]
            : [
                imageObjectJsonLd({
                  url: "/images/cover.png",
                  caption: article.title,
                }),
              ]),
          ...videos,
          breadcrumb,
          webpage,
          newsArticleJsonLd({
            headline: article.title,
            description,
            url,
            imageUrl: article.featuredImage ?? "/images/cover.png",
            imageCaption: article.title,
            datePublished: article.createdAt,
            dateModified: article.updatedAt,
            authorName,
            section: primaryTopic?.title,
            keywords: article.topics.map((t) => t.title),
            breadcrumb,
          }),
        ]),
      ),
    ],
  }
}
