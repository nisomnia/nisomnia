"use client"

import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import { MenuIcon, SearchIcon, XIcon } from "lucide-react"
import * as React from "react"

import { fetchClient } from "@/api/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Sheet,
  SheetClose,
  SheetPopup,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils/style"

const LANGUAGE = "id"
const POPULAR_LIMIT = 8
const APP_TITLE =
  (import.meta.env.PUBLIC_APP_TITLE as string | undefined) ?? "Nisomnia"

function usePopularTopics() {
  return useQuery({
    queryKey: ["topics", "popular", LANGUAGE, POPULAR_LIMIT],
    queryFn: async () => {
      const { data, error } = await fetchClient.POST(
        "/topic/by-article-count",
        {
          body: { language: LANGUAGE, perPage: POPULAR_LIMIT },
        },
      )
      if (error) throw error
      return data ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}

function SearchForm({
  className,
  onSubmit,
  autoFocus = false,
}: {
  className?: string
  onSubmit?: () => void
  autoFocus?: boolean
}) {
  const navigate = useNavigate()
  const [query, setQuery] = React.useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate({
      to: "/article",
      search: { q: trimmed },
    })
    setQuery("")
    onSubmit?.()
  }

  return (
    <form
      className={cn("flex w-full items-center", className)}
      onSubmit={handleSubmit}
    >
      <InputGroup className="rounded-full">
        <InputGroupAddon className="ps-3.5">
          <SearchIcon className="text-muted-foreground size-4.5" />
        </InputGroupAddon>
        <InputGroupInput
          autoFocus={autoFocus}
          className="px-0"
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search articles..."
          type="search"
          value={query}
        />
      </InputGroup>
      <button className="sr-only" type="submit">
        Search
      </button>
    </form>
  )
}

function TopicPills({
  topics,
}: {
  topics: { slug: string; title: string; count: number }[]
}) {
  return (
    <nav aria-label="Popular topics" className="flex items-center gap-2">
      {topics.map((topic) => (
        <Badge
          key={topic.slug}
          className="cursor-pointer"
          render={<Link params={{ slug: topic.slug }} to="/topic/$slug" />}
          variant="secondary"
        >
          {topic.title}
          <span className="text-muted-foreground/72 ms-1">({topic.count})</span>
        </Badge>
      ))}
    </nav>
  )
}

function MobileSearchSheet() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger render={<Button size="icon" variant="ghost" />}>
        <SearchIcon />
        <span className="sr-only">Open search</span>
      </SheetTrigger>
      <SheetPopup
        className="row-start-1 h-auto max-h-none justify-start border-b"
        showCloseButton={false}
        side="top"
      >
        <div className="flex items-center gap-2 p-4">
          <SearchForm
            autoFocus
            className="flex-1"
            onSubmit={() => setOpen(false)}
          />
          <SheetClose render={<Button size="icon" variant="ghost" />}>
            <XIcon />
            <span className="sr-only">Close search</span>
          </SheetClose>
        </div>
      </SheetPopup>
    </Sheet>
  )
}

function MobileMenuSheet({
  topics,
}: {
  topics: { slug: string; title: string; count: number }[]
}) {
  return (
    <Sheet>
      <SheetTrigger render={<Button size="icon" variant="ghost" />}>
        <MenuIcon />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetPopup side="right">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Link className="flex items-center gap-2" to="/">
              <img
                alt={APP_TITLE}
                className="size-8 rounded-md"
                src="/icons/android-icon-192x192.png"
              />
              <span className="font-heading font-semibold">{APP_TITLE}</span>
            </Link>
            <SheetClose render={<Button size="icon" variant="ghost" />}>
              <XIcon />
              <span className="sr-only">Close menu</span>
            </SheetClose>
          </div>
          <SearchForm onSubmit={() => undefined} />
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground text-sm font-medium">
              Popular topics
            </p>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Badge
                  key={topic.slug}
                  className="cursor-pointer"
                  render={
                    <Link params={{ slug: topic.slug }} to="/topic/$slug" />
                  }
                  variant="secondary"
                >
                  {topic.title}
                  <span className="text-muted-foreground/72 ms-1">
                    ({topic.count})
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </SheetPopup>
    </Sheet>
  )
}

export function Header() {
  const topicsQuery = usePopularTopics()
  const topics = topicsQuery.data ?? []

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link className="flex shrink-0 items-center gap-2" to="/">
          <img
            alt={APP_TITLE}
            className="size-8 rounded-md"
            src="/icons/android-icon-192x192.png"
          />
          <span className="font-heading hidden text-lg font-semibold sm:inline">
            {APP_TITLE}
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-4 md:flex">
          {topics.length > 0 && <TopicPills topics={topics} />}
        </div>

        <div className="flex flex-1 items-center justify-end gap-1 md:flex-none">
          <div className="hidden w-full max-w-xs lg:block">
            <SearchForm />
          </div>
          <div className="flex items-center md:hidden">
            <MobileSearchSheet />
            <MobileMenuSheet topics={topics} />
          </div>
        </div>
      </div>
    </header>
  )
}
