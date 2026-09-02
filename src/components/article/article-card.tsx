"use client"

import { Link } from "@tanstack/react-router"

import { Image } from "@/components/image"
import { cn } from "@/lib/utils/style"

const SPOTLIGHT_BREAKPOINTS = [384, 512]

const CARD_VARIANTS = {
  compact: {
    imageAspect: "aspect-4/3",
    imageWrapperClassName: "w-24 shrink-0",
    imageClassName:
      "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
    imageHeight: 144,
    imageSizes: "96px",
    imageWidth: 192,
    linkClassName:
      "group flex items-start gap-3 rounded-xl border bg-card p-3 transition-shadow hover:shadow-md",
    textClassName: "min-w-0",
    titleClassName:
      "line-clamp-2 text-sm leading-snug font-semibold group-hover:underline",
    excerptClassName: "mt-1 line-clamp-2 text-xs text-muted-foreground",
  },
  default: {
    imageAspect: "aspect-video",
    imageWrapperClassName: "w-full",
    imageClassName:
      "h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]",
    imageHeight: 360,
    imageSizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    imageWidth: 640,
    linkClassName:
      "group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md",
    textClassName: "flex flex-1 flex-col gap-2 p-4",
    titleClassName:
      "line-clamp-2 text-lg leading-snug font-semibold group-hover:underline",
    excerptClassName: "line-clamp-2 text-sm text-muted-foreground",
  },
  spotlight: {
    imageAspect: "aspect-video",
    imageWrapperClassName: "w-full",
    imageClassName:
      "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]",
    imageHeight: 288,
    imageSizes: "(max-width: 1024px) 100vw, 50vw",
    imageWidth: 512,
    linkClassName:
      "group flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lg",
    textClassName: "flex flex-1 flex-col gap-3 p-5 sm:p-6",
    titleClassName:
      "line-clamp-3 text-xl leading-tight font-bold tracking-tight group-hover:underline sm:text-2xl",
    excerptClassName: "line-clamp-3 text-sm text-muted-foreground sm:text-base",
  },
} as const

export function ArticleCard({
  title,
  slug,
  featuredImage,
  excerpt,
  className,
  titleClassName,
  excerptClassName,
  priority,
  variant = "default",
}: {
  title: string
  slug: string
  featuredImage?: string
  excerpt?: string
  className?: string
  titleClassName?: string
  excerptClassName?: string
  priority?: boolean
  variant?: keyof typeof CARD_VARIANTS
}) {
  const styles = CARD_VARIANTS[variant]

  return (
    <Link
      to="/article/$slug"
      params={{ slug }}
      className={cn(styles.linkClassName, className)}
    >
      {featuredImage && (
        <div
          className={cn(
            "shrink-0 overflow-hidden",
            styles.imageWrapperClassName,
            styles.imageAspect,
          )}
        >
          <Image
            src={featuredImage}
            alt={title}
            layout="constrained"
            width={styles.imageWidth}
            height={styles.imageHeight}
            sizes={styles.imageSizes}
            background="auto"
            breakpoints={
              variant === "spotlight" ? SPOTLIGHT_BREAKPOINTS : undefined
            }
            className={styles.imageClassName}
            unstyled
            priority={priority}
          />
        </div>
      )}
      <div className={styles.textClassName}>
        <h2 className={cn(styles.titleClassName, titleClassName)}>{title}</h2>
        {excerpt && (
          <p className={cn(styles.excerptClassName, excerptClassName)}>
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
