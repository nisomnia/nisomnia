"use client"

import { Link, useNavigate } from "@tanstack/react-router"
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
import { SidebarTrigger } from "@/components/ui/sidebar"
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
      role="search"
      onSubmit={handleSubmit}
    >
      <InputGroup className="rounded-full">
        <InputGroupInput
          aria-label="Cari artikel"
          autoFocus={autoFocus}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Cari artikel..."
          type="search"
          value={query}
        />
        <InputGroupAddon className="p-0">
          <Button
            aria-label="Cari artikel"
            type="submit"
            size="icon"
            variant="ghost"
            disabled={!query.trim()}
          >
            <SearchIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}

function MobileSearchDialog() {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  function closeSearch() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <>
      <Button
        ref={triggerRef}
        size="icon"
        variant="ghost"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
        <span className="sr-only">Buka pencarian</span>
      </Button>
      {open && (
        <dialog
          aria-label="Cari artikel"
          className="search-dialog"
          onClose={closeSearch}
          ref={(dialog) => {
            if (dialog && !dialog.open) dialog.showModal()
          }}
        >
          <div className="flex items-center gap-2 p-4">
            <SearchForm autoFocus className="flex-1" onSubmit={closeSearch} />
            <Button
              aria-label="Tutup pencarian"
              size="icon"
              variant="ghost"
              onClick={closeSearch}
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
  return (
    <header className="site-header sticky top-0 z-40">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-8">
        <SidebarTrigger />
        <Logo />
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-1 lg:flex"
        >
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
        <div className="ml-auto flex min-w-0 items-center gap-2">
          <div className="hidden w-52 xl:block">
            <SearchForm />
          </div>
          <div className="xl:hidden">
            <MobileSearchDialog />
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
