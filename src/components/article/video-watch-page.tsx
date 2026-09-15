import { Link, getRouteApi } from "@tanstack/react-router"

import { YouTubeWatchPlayer } from "@/components/article/youtube-embed"

const Route = getRouteApi("/article/$slug_/video/$videoId")

export function VideoWatchPage() {
  const { article, video } = Route.useLoaderData()

  return (
    <main className="page-shell">
      <Link
        to="/article/$slug"
        params={{ slug: article.slug }}
        className="eyebrow inline-flex min-h-11 items-center"
      >
        Kembali ke artikel
      </Link>

      <div className="mt-4 rounded-2xl bg-black p-1 shadow-2xl shadow-black/20 sm:rounded-3xl sm:p-2">
        <YouTubeWatchPlayer videoId={video.videoId} title={video.title} />
      </div>

      <div className="mt-8 grid gap-8 border-b pb-10 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)] lg:gap-16">
        <div className="min-w-0">
          <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            {video.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            {video.description.trim() ? video.description : article.excerpt}
          </p>
        </div>

        <aside className="border-t pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
          <p className="text-sm text-muted-foreground">Bagian dari artikel</p>
          <Link
            to="/article/$slug"
            params={{ slug: article.slug }}
            className="mt-2 inline-block text-lg leading-snug font-semibold hover:underline hover:underline-offset-4"
          >
            {article.title}
          </Link>
        </aside>
      </div>
    </main>
  )
}
