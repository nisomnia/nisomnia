import { Link } from "@tanstack/react-router"

import { Logo } from "@/components/layout/logo"

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Anime, game, manga, film, dan teknologi.
          </p>
        </div>
        <nav aria-label="Navigasi footer" className="flex flex-wrap gap-2">
          <Link to="/" activeOptions={{ exact: true }} className="nav-link">
            Beranda
          </Link>
          <Link to="/article" className="nav-link">
            Artikel
          </Link>
          <Link to="/topic" className="nav-link">
            Topik
          </Link>
        </nav>
      </div>
    </footer>
  )
}
