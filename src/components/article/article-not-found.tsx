import { Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

export function ArticleNotFound({ slug }: { slug: string }) {
  return (
    <div className="status-page">
      <h1 className="text-2xl font-semibold">Artikel tidak ditemukan.</h1>
      <p className="mt-2 text-muted-foreground">
        Tidak ada artikel untuk &ldquo;{slug}&rdquo;.
      </p>
      <Button className="mt-6" render={<Link to="/article" />}>
        Jelajahi artikel
      </Button>
    </div>
  )
}
