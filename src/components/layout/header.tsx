"use client"

import { useNavigate } from "@tanstack/react-router"
import { SearchIcon, XIcon } from "lucide-react"
import * as React from "react"

import { Logo } from "@/components/layout/logo"
import { ThemeSwitcher } from "@/components/layout/theme-switcher"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils/style"

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
          <SearchIcon className="size-4.5 text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput
          aria-label="Cari artikel"
          autoFocus={autoFocus}
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

function MobileSearchDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
        <SearchIcon />
        <span className="sr-only">Open search</span>
      </Button>
      {open && (
        <dialog
          aria-label="Search articles"
          className="fixed inset-x-0 top-0 m-0 h-auto max-h-none w-full max-w-none border-0 border-b bg-background p-0 text-foreground backdrop:bg-black/50"
          onClose={() => setOpen(false)}
          ref={(dialog) => {
            if (dialog && !dialog.open) dialog.showModal()
          }}
        >
          <div className="flex items-center gap-2 p-4">
            <SearchForm
              autoFocus
              className="flex-1"
              onSubmit={() => setOpen(false)}
            />
            <Button
              aria-label="Close search"
              size="icon"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              <XIcon />
            </Button>
          </div>
        </dialog>
      )}
    </>
  )
}

export function Header() {
  const { open } = useSidebar()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/60 shadow-sm shadow-black/5 backdrop-blur-[20px] backdrop-saturate-[180%] will-change-[backdrop-filter] supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Logo showText={false} className="block lg:hidden" />
          {!open && <Logo showText={false} className="hidden lg:block" />}
        </div>

        <div className="flex flex-1 justify-center">
          <div className="hidden w-full max-w-md lg:flex">
            <SearchForm className="flex-1" />
          </div>
        </div>

        <div className="flex w-fit items-center justify-end gap-2">
          <ThemeSwitcher />
          <div className="lg:hidden">
            <MobileSearchDialog />
          </div>
        </div>
      </div>
    </header>
  )
}
