import { Link } from "@tanstack/react-router"

import { Card } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card-header"
import { CardPanel } from "@/components/ui/card-panel"
import { CardTitle } from "@/components/ui/card-title"

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
    <Link to="/article/$slug" params={{ slug }} className="group block">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        {featuredImage ? (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={featuredImage}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="bg-muted aspect-video w-full" />
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2 text-sm leading-snug">
            {title}
          </CardTitle>
        </CardHeader>
        {excerpt && (
          <CardPanel className="pt-0">
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {excerpt}
            </p>
          </CardPanel>
        )}
      </Card>
    </Link>
  )
}
