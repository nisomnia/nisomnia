import { Link } from "@tanstack/react-router"
import { Image } from "@unpic/react"

import { cn } from "@/lib/utils/style"

export function ArticleCard({
  title,
  slug,
  featuredImage,
  excerpt,
  className,
  titleClassName,
  excerptClassName,
}: {
  title: string
  slug: string
  featuredImage?: string
  excerpt?: string
  className?: string
  titleClassName?: string
  excerptClassName?: string
}) {
  return (
    <Link
      to="/article/$slug"
      params={{ slug }}
      className={cn("block rounded-lg p-2 transition-shadow", className)}
    >
      {featuredImage && (
        <Image
          src={featuredImage}
          alt={title}
          layout="fullWidth"
          aspectRatio={16 / 9}
          objectFit="cover"
          className="mb-4 rounded-lg"
        />
      )}
      <h2
        className={cn(
          "line-clamp-2 text-sm font-semibold hover:underline sm:text-base md:text-lg",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {excerpt && (
        <p
          className={cn(
            "text-muted-foreground mt-2 line-clamp-3 text-xs sm:text-sm",
            excerptClassName,
          )}
        >
          {excerpt}
        </p>
      )}
    </Link>
  )
}
