import { Link } from "@tanstack/react-router"

export function ArticleCard({
  title,
  slug,
  featuredImage,
  excerpt,
}: {
  title: string
  slug: string
  featuredImage?: string
  excerpt?: string
}) {
  return (
    <Link
      to="/article/$slug"
      params={{ slug }}
      className="block rounded-lg border p-6 transition-shadow hover:shadow-md"
    >
      {featuredImage && (
        <img
          src={featuredImage}
          alt={title}
          className="mb-4 aspect-video w-full rounded-lg object-cover"
        />
      )}
      <h2 className="line-clamp-2 text-sm font-semibold hover:underline sm:text-base md:text-lg">
        {title}
      </h2>
      {excerpt && (
        <p className="text-muted-foreground mt-2 line-clamp-3 text-xs sm:text-sm">
          {excerpt}
        </p>
      )}
    </Link>
  )
}
