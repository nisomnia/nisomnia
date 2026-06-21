import { Link } from "@tanstack/react-router"

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
        <img
          src={featuredImage}
          alt={title}
          className="mb-4 aspect-video w-full rounded-lg object-cover"
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
