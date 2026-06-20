"use client"

import { Link, useNavigate } from "@tanstack/react-router"
import { MenuIcon, SearchIcon, XIcon } from "lucide-react"
import * as React from "react"

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
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils/style"

const APP_TITLE =
  (import.meta.env.PUBLIC_APP_TITLE as string | undefined) ?? "Nisomnia"

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

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
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

        <div className="hidden flex-1 justify-center lg:flex">
          <div className="w-full max-w-md">
            <SearchForm />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-1 lg:flex-none">
          <div className="flex items-center lg:hidden">
            <MobileSearchSheet />
            <Button onClick={onMenuClick} size="icon" variant="ghost">
              <MenuIcon />
              <span className="sr-only">Open topics</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
