import { Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

export function ArticleNotFound({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-3xl p-8 text-center">
      <h1 className="text-2xl font-semibold">Article not found</h1>
      <p className="text-muted-foreground mt-2">
        Could not find article &ldquo;{slug}&rdquo;.
      </p>
      <Button className="mt-6" render={<Link to="/article" />}>
        Browse articles
      </Button>
    </div>
  )
}
