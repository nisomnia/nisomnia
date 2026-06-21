import { siteConfig, robotsConfig } from "./config"

export interface SeoMetaOptions {
  title: string
  description: string
  url: string
  type?: "website" | "article"
  image?: {
    url: string
    secureUrl?: string
    width?: number
    height?: number
    alt?: string
    type?: string
  }
  publishedTime?: string | null
  modifiedTime?: string | null
  section?: string
  tags?: string[]
  noindex?: boolean
  canonical?: string
  hreflang?: { lang: string; href: string }[]
}

export interface SeoMetaResult {
  title: string
  meta: Record<string, string>[]
  links: Record<string, string>[]
}

export function buildSeoMeta(options: SeoMetaOptions): SeoMetaResult {
  const {
    title,
    description,
    url,
    type = "website",
    image,
    publishedTime,
    modifiedTime,
    section,
    tags,
    noindex = false,
    canonical,
    hreflang,
  } = options

  const meta: Record<string, string>[] = [
    { name: "description", content: description },
    {
      name: "robots",
      content: noindex ? robotsConfig.noindex : robotsConfig.index,
    },
    { property: "og:locale", content: siteConfig.defaultLocale },
    { property: "og:locale:alternate", content: siteConfig.alternateLocale },
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: siteConfig.siteName },
    { name: "twitter:card", content: siteConfig.twitter.card },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:site", content: siteConfig.twitter.site },
  ]

  if (image) {
    meta.push({ property: "og:image", content: image.url })
    if (image.secureUrl)
      meta.push({ property: "og:image:secure_url", content: image.secureUrl })
    if (image.width)
      meta.push({ property: "og:image:width", content: String(image.width) })
    if (image.height)
      meta.push({ property: "og:image:height", content: String(image.height) })
    if (image.alt) meta.push({ property: "og:image:alt", content: image.alt })
    if (image.type)
      meta.push({ property: "og:image:type", content: image.type })
    meta.push({ name: "twitter:image", content: image.url })
  }

  if (type === "article") {
    meta.push({
      property: "article:publisher",
      content: siteConfig.publisher.facebookUrl,
    })
    if (publishedTime)
      meta.push({ property: "article:published_time", content: publishedTime })
    if (modifiedTime)
      meta.push({ property: "article:modified_time", content: modifiedTime })
    if (section) meta.push({ property: "article:section", content: section })
    if (tags)
      for (const tag of tags)
        meta.push({ property: "article:tag", content: tag })
  }

  if (modifiedTime)
    meta.push({ property: "og:updated_time", content: modifiedTime })

  const links: Record<string, string>[] = []
  if (canonical) links.push({ rel: "canonical", href: canonical })
  if (hreflang) {
    for (const { lang, href } of hreflang) {
      links.push({ rel: "alternate", hreflang: lang, href })
    }
  }

  return { title, meta, links }
}
