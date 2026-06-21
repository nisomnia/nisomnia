import { siteConfig } from "./config"

type JsonLd = Record<string, unknown>

function imageUrl(path: string): string {
  if (!path) return ""
  if (path.startsWith("http")) return path
  return path.startsWith("/")
    ? `${siteConfig.siteUrl}${path}`
    : `${siteConfig.siteUrl}/${path}`
}

export function organizationJsonLd(): JsonLd {
  return {
    "@type": "Organization",
    "@id": `${siteConfig.siteUrl}/#organization`,
    name: siteConfig.organization.name,
    url: siteConfig.siteUrl,
    sameAs: siteConfig.organization.sameAs,
    logo: {
      "@type": "ImageObject",
      url: siteConfig.organization.logo,
    },
    contactPoint: siteConfig.organization.contactPoints,
    description: siteConfig.organization.description,
    legalName: siteConfig.organization.legalName,
    foundingDate: siteConfig.organization.foundingDate,
    numberOfEmployees: siteConfig.organization.numberOfEmployees,
    location: siteConfig.organization.location,
  }
}

export function websiteJsonLd(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.siteUrl}/#website`,
    url: siteConfig.siteUrl,
    name: siteConfig.siteName,
    alternateName: siteConfig.website.alternateName,
    publisher: {
      "@id": `${siteConfig.siteUrl}/#organization`,
    },
    inLanguage: siteConfig.inLanguage,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.siteUrl}/article?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function placeJsonLd(): JsonLd {
  return {
    "@type": "Place",
    "@id": `${siteConfig.siteUrl}/#place`,
    name: siteConfig.organization.location.name,
  }
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLd {
  return {
    "@type": "BreadcrumbList",
    "@id": `${siteConfig.siteUrl}/#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function webpageJsonLd(options: {
  name: string
  url: string
  description: string
  datePublished?: string | null
  dateModified?: string | null
  imageUrl?: string
  breadcrumb?: JsonLd
}): JsonLd {
  const {
    name,
    url,
    description,
    datePublished,
    dateModified,
    imageUrl,
    breadcrumb,
  } = options
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
    inLanguage: siteConfig.inLanguage,
    primaryImageOfPage: imageUrl ? { "@id": `${url}#primaryimage` } : undefined,
    datePublished: datePublished ?? undefined,
    dateModified: dateModified ?? undefined,
    breadcrumb: breadcrumb?.["@id"] ? { "@id": breadcrumb["@id"] } : undefined,
  }
}

export function collectionPageJsonLd(options: {
  name: string
  url: string
  description?: string
  breadcrumb?: JsonLd
}): JsonLd {
  const { name, url, description, breadcrumb } = options
  return {
    "@type": "CollectionPage",
    "@id": `${url}#collectionpage`,
    url,
    name,
    description: description ?? undefined,
    isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
    inLanguage: siteConfig.inLanguage,
    breadcrumb: breadcrumb?.["@id"] ? { "@id": breadcrumb["@id"] } : undefined,
  }
}

export function imageObjectJsonLd(options: {
  url: string
  width?: number
  height?: number
  caption?: string
  contentUrl?: string
}): JsonLd {
  const { url, width, height, caption, contentUrl } = options
  return {
    "@type": "ImageObject",
    "@id": `${url}#primaryimage`,
    url: imageUrl(url),
    contentUrl: imageUrl(contentUrl ?? url),
    width: width ?? undefined,
    height: height ?? undefined,
    caption: caption ?? undefined,
    inLanguage: siteConfig.inLanguage,
  }
}

export function personJsonLd(options: { name: string; url?: string }): JsonLd {
  const { name, url } = options
  return {
    "@type": "Person",
    "@id": `${siteConfig.siteUrl}/#/schema/person/${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    url: url ?? undefined,
    worksFor: { "@id": `${siteConfig.siteUrl}/#organization` },
  }
}

export function newsArticleJsonLd(options: {
  headline: string
  description: string
  url: string
  imageUrl?: string
  imageWidth?: number
  imageHeight?: number
  imageCaption?: string
  datePublished?: string | null
  dateModified?: string | null
  authorName?: string
  authorUrl?: string
  section?: string
  keywords?: string[]
  breadcrumb?: JsonLd
}): JsonLd {
  const {
    headline,
    description,
    url,
    imageUrl,
    imageWidth,
    imageHeight,
    imageCaption,
    datePublished,
    dateModified,
    authorName,
    authorUrl,
    section,
    keywords,
    breadcrumb,
  } = options

  const author = authorName
    ? personJsonLd({ name: authorName, url: authorUrl })
    : undefined
  const image = imageUrl
    ? imageObjectJsonLd({
        url: imageUrl,
        width: imageWidth,
        height: imageHeight,
        caption: imageCaption,
      })
    : undefined

  return {
    "@type": "NewsArticle",
    "@id": `${url}#richSnippet`,
    headline,
    description,
    image: image ? { "@id": image["@id"] } : undefined,
    keywords: keywords?.join(", ") ?? undefined,
    datePublished: datePublished ?? undefined,
    dateModified: dateModified ?? undefined,
    articleSection: section ?? undefined,
    author: author ? { "@id": author["@id"] } : undefined,
    publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
    copyrightYear: datePublished
      ? new Date(datePublished).getFullYear()
      : undefined,
    copyrightHolder: { "@id": `${siteConfig.siteUrl}/#organization` },
    name: headline,
    isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
    inLanguage: siteConfig.inLanguage,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    breadcrumb: breadcrumb?.["@id"] ? { "@id": breadcrumb["@id"] } : undefined,
  }
}

export function articleJsonLd(options: {
  headline: string
  description: string
  url: string
  keywords?: string[]
  datePublished?: string | null
  dateModified?: string | null
  authorName?: string
  authorUrl?: string
}): JsonLd {
  const {
    headline,
    description,
    url,
    keywords,
    datePublished,
    dateModified,
    authorName,
    authorUrl,
  } = options
  const author = authorName
    ? personJsonLd({ name: authorName, url: authorUrl })
    : undefined
  return {
    "@type": "Article",
    "@id": `${url}#richSnippet`,
    headline,
    description,
    keywords: keywords?.join(", ") ?? undefined,
    datePublished: datePublished ?? undefined,
    dateModified: dateModified ?? undefined,
    author: author ? { "@id": author["@id"] } : undefined,
    publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
    name: headline,
    isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
    inLanguage: siteConfig.inLanguage,
    mainEntityOfPage: { "@id": `${url}#webpage` },
  }
}

export function videoObjectJsonLd(options: {
  name: string
  description: string
  videoId: string
  uploadDate?: string | null
  thumbnailUrl?: string
  contentUrl?: string
  embedUrl?: string
  duration?: string
  width?: number
  height?: number
  isPartOf?: JsonLd
}): JsonLd {
  const {
    name,
    description,
    videoId,
    uploadDate,
    thumbnailUrl,
    contentUrl,
    embedUrl,
    duration,
    width,
    height,
    isPartOf,
  } = options
  return {
    "@type": "VideoObject",
    "@id": `${siteConfig.siteUrl}/#video-${videoId}`,
    name,
    description,
    thumbnailUrl:
      thumbnailUrl ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    contentUrl: contentUrl ?? `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: embedUrl ?? `https://www.youtube.com/embed/${videoId}`,
    uploadDate: uploadDate ?? undefined,
    duration: duration ?? undefined,
    width: width ?? undefined,
    height: height ?? undefined,
    isFamilyFriendly: true,
    isPartOf: isPartOf
      ? { "@id": isPartOf["@id"] ?? `${siteConfig.siteUrl}/#website` }
      : undefined,
  }
}

export function buildGraph(items: JsonLd[]): {
  "@context": string
  "@graph": JsonLd[]
} {
  return {
    "@context": "https://schema.org",
    "@graph": items.filter((item) => Object.keys(item).length > 0),
  }
}

export function jsonLdScript(graph: {
  "@context": string
  "@graph": JsonLd[]
}) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify(graph),
  }
}

export { siteConfig, imageUrl }
