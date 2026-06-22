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
        <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={featuredImage}
            alt={title}
            layout="fullWidth"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            background="auto"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <h2
        className={cn(
          "line-clamp-3 text-lg font-semibold hover:underline",
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
