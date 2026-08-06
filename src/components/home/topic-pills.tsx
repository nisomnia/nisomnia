"use client"

import { Link } from "@tanstack/react-router"
import {
  BookOpenIcon,
  ClapperboardIcon,
  CpuIcon,
  FilmIcon,
  Gamepad2Icon,
  LayoutGridIcon,
} from "lucide-react"

import { cn } from "@/lib/utils/style"

export const HOME_TOPICS = [
  { label: "Anime", slug: "anime", icon: ClapperboardIcon },
  { label: "Game", slug: "game", icon: Gamepad2Icon },
  { label: "Manga", slug: "manga", icon: BookOpenIcon },
  { label: "Film", slug: "film", icon: FilmIcon },
  { label: "Teknologi", slug: "teknologi", icon: CpuIcon },
] as const

export function TopicPills({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav
      aria-label="Topik"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        to="/article"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          !activeSlug
            ? "border-primary bg-primary text-primary-foreground"
            : "border-input bg-popover text-foreground hover:bg-accent",
        )}
      >
        <LayoutGridIcon className="size-4" />
        Semua
      </Link>
      {HOME_TOPICS.map(({ label, slug, icon: Icon }) => (
        <Link
          key={slug}
          to="/topic/$slug"
          params={{ slug }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            activeSlug === slug
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-popover text-foreground hover:bg-accent",
          )}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
