import { Link } from "@tanstack/react-router"

import type { TopicResponse } from "@/hooks/api/topic"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface TopicHeaderProps {
  topic: TopicResponse | undefined
  isLoading: boolean
  isError: boolean
  slug: string
  retry: () => void
}

export function TopicHeader({
  topic,
  isLoading,
  isError,
  slug,
  retry,
}: TopicHeaderProps) {
  if (isLoading) {
    return (
      <div className="page-heading" role="status">
        <span className="sr-only">Memuat topik...</span>
        <Skeleton className="h-12 w-48" />
      </div>
    )
  }

  if (isError || !topic) {
    return (
      <div className="status-page">
        <h1>
          {isError ? "Topik belum dapat dimuat." : "Topik tidak ditemukan."}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isError
            ? "Periksa koneksi Anda, lalu coba lagi."
            : `Tidak ada topik untuk "${slug}".`}
        </p>
        {isError && (
          <Button variant="outline" onClick={retry}>
            Coba lagi
          </Button>
        )}
        <Button render={<Link to="/topic" />}>Lihat semua topik</Button>
      </div>
    )
  }

  return (
    <div className="page-heading">
      <Link to="/topic" className="eyebrow inline-flex min-h-11 items-center">
        Semua topik
      </Link>
      <h1>{topic.title}</h1>
      <p>Artikel terbaru seputar {topic.title}.</p>
    </div>
  )
}
