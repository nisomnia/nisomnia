"use client"

import { useNavigate } from "@tanstack/react-router"
import { SearchIcon, XIcon } from "lucide-react"
import * as React from "react"

import { Logo } from "@/components/layout/logo"
import { ThemeSwitcher } from "@/components/layout/theme-switcher"
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
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
          <SearchIcon className="text-muted-foreground size-4.5" />
        </InputGroupAddon>
        <InputGroupInput
          aria-label="Cari artikel"
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

export function Header() {
  const { open } = useSidebar()

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          {!open && <Logo showText={false} />}
        </div>

        <div className="flex flex-1 justify-center">
          <Group className="hidden w-full max-w-md lg:flex">
            <SearchForm className="flex-1" />
          </Group>
        </div>

        <div className="flex w-fit items-center justify-end gap-2">
          <ThemeSwitcher />
          <div className="lg:hidden">
            <MobileSearchSheet />
          </div>
        </div>
      </div>
    </header>
  )
}
