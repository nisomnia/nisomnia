"use client"

import { Link } from "@tanstack/react-router"
import { ImageIcon } from "lucide-react"

import { Image } from "@/components/image"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils/style"

export function ArticleCard({
  title,
  slug,
  featuredImage,
  excerpt,
  className,
  priority,
  createdAt,
  variant = "default",
}: {
  title: string
  slug: string
  featuredImage?: string
  excerpt?: string
  className?: string
  priority?: boolean
  createdAt?: string
  variant?: "default" | "compact" | "spotlight"
}) {
  return (
    <Link
      to="/article/$slug"
      params={{ slug }}
      className={cn("article-row", className)}
      data-variant={variant}
    >
      <div className="article-row-image">
        {featuredImage ? (
          <Image
            src={featuredImage}
            alt=""
            layout="constrained"
            width={640}
            height={480}
            sizes={
              variant === "spotlight"
                ? "(max-width: 640px) 32vw, 420px"
                : "(max-width: 640px) 28vw, 240px"
            }
            background="auto"
            className="size-full object-cover"
            unstyled
            priority={priority}
          />
        ) : (
          <ImageIcon
            aria-hidden="true"
            className="size-6 text-muted-foreground"
          />
        )}
      </div>
      <div className="article-row-copy">
        {variant === "spotlight" && <p className="eyebrow">Sorotan</p>}
        <h2 className="article-row-title">{title}</h2>
        {excerpt && <p className="article-row-excerpt">{excerpt}</p>}
        {createdAt && (
          <time className="text-xs text-muted-foreground" dateTime={createdAt}>
            {new Date(createdAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Asia/Jakarta",
            })}
          </time>
        )}
      </div>
    </Link>
  )
}

export function ArticleRowSkeleton({
  variant,
}: { variant?: "compact" | "spotlight" } = {}) {
  return (
    <div className="article-row" data-variant={variant} aria-hidden="true">
      <Skeleton className="article-row-image" />
      <div className="article-row-copy w-full">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
