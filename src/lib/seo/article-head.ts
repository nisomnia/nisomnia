import type { ArticleResponse } from "@/hooks/api/article"
import type { VideoMeta } from "@/lib/article/types"

import { buildOptimizedImageUrl } from "@/components/image"
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
  const author = article.authors[0]
  const authorName = author?.name ?? author?.username
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
  const authorUrl = author?.username
    ? `${siteConfig.siteUrl}/user/${author.username}`
    : undefined
  const imageUrl =
    article.featuredImage ?? `${siteConfig.siteUrl}/images/cover.png`
  const videoIds = extractYouTubeIds(article.content)
  const webpage = webpageJsonLd({
    name: article.title,
    url,
    description,
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    imageUrl,
    breadcrumb,
  })
  const videos = videoIds.map((videoId) => {
    const meta = videoMeta.find((v) => v.videoId === videoId)
    return videoObjectJsonLd({
      name: meta?.title ?? article.title,
      description: meta?.description ?? description,
      videoId,
      pageUrl: url,
      uploadDate: meta?.uploadDate ?? article.createdAt,
      thumbnailUrl: meta?.thumbnailUrl,
      duration: meta?.duration ?? undefined,
      width: meta?.width,
      height: meta?.height,
    })
  })
  const links: typeof seo.links = [...seo.links]
  if (article.featuredImage) {
    links.push({
      rel: "preload",
      as: "image",
      href: buildOptimizedImageUrl(article.featuredImage, { width: 1024 }),
      fetchPriority: "high",
    })
  }

  return {
    ...seo,
    links,
    scripts: [
      jsonLdScript(
        buildGraph([
          placeJsonLd(),
          organizationJsonLd(),
          websiteJsonLd(),
          imageObjectJsonLd({
            url: imageUrl,
            caption: article.title,
          }),
          ...videos,
          breadcrumb,
          webpage,
          newsArticleJsonLd({
            headline: article.title,
            description,
            url,
            imageUrl:
              article.featuredImage ?? `${siteConfig.siteUrl}/images/cover.png`,
            imageCaption: article.title,
            datePublished: article.createdAt,
            dateModified: article.updatedAt,
            authorName,
            authorUrl,
            section: primaryTopic?.title,
            keywords: article.topics.map((t) => t.title),
            breadcrumb,
          }),
        ]),
      ),
    ],
  }
}
