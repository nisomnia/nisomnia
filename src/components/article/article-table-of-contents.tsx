"use client"

import { ChevronDownIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils/style"

interface ArticleTableOfContentsProps {
  headings: {
    id: string
    text: string
    level: number
  }[]
  variant?: "sidebar" | "collapsible" | "desktop-collapsible"
}

interface CollapsibleCardProps {
  open: boolean
  centeredTitle: boolean
  className?: string
  onToggle: (open: boolean) => void
  children: React.ReactNode
}

function CollapsibleCard({
  open,
  centeredTitle,
  className,
  onToggle,
  children,
}: CollapsibleCardProps) {
  return (
    <details
      className={cn("rounded-lg border", className)}
      open={open}
      onToggle={(e) => onToggle(e.currentTarget.open)}
    >
      <summary
        className={cn(
          "relative flex cursor-pointer items-center p-3 text-sm font-semibold select-none",
          centeredTitle ? "justify-center" : "justify-between",
        )}
      >
        <span className={cn(centeredTitle && "px-6")}>Table of Contents</span>
        <ChevronDownIcon
          className={cn(
            "size-4 transition-transform",
            centeredTitle ? "absolute right-3" : "relative",
            open && "rotate-180",
          )}
        />
      </summary>
      <nav aria-label="Table of contents" className="border-t p-3 pt-2">
        {children}
      </nav>
    </details>
  )
}

export function ArticleTableOfContents({
  headings,
  variant = "sidebar",
}: ArticleTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [open, setOpen] = useState(variant !== "collapsible")
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!activeId || !listRef.current) return

    const activeLink = listRef.current.querySelector(
      `a[href="#${CSS.escape(activeId)}"]`,
    )
    if (!(activeLink instanceof HTMLElement)) return

    activeLink.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [activeId])

  useEffect(() => {
    const elements = headings.reduce<HTMLElement[]>((acc, heading) => {
      const el = document.getElementById(heading.id)
      if (el) acc.push(el)
      return acc
    }, [])

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.reduce<string[]>((acc, entry) => {
          if (entry.isIntersecting) acc.push(entry.target.id)
          return acc
        }, [])

        if (intersecting.length === 0) return

        const sorted = intersecting
          .map((id) => document.getElementById(id))
          .filter((el): el is HTMLElement => el !== null)

        sorted.sort((a, b) => {
          const position = a.compareDocumentPosition(b)
          return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        })

        const first = sorted[0]
        if (!first) return

        setActiveId(first.id)
      },
      {
        rootMargin: "0px 0px -80% 0px",
        threshold: 0,
      },
    )

    elements.forEach((element) => {
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  const list = (
    <ul
      ref={listRef}
      className="flex max-h-[calc(100dvh-8rem)] flex-col gap-1 overflow-y-auto pr-1"
    >
      {headings.map((heading) => (
        <li
          key={heading.id}
          style={{ paddingLeft: `${Math.max(0, heading.level - 1)}rem` }}
        >
          <a
            href={`#${heading.id}`}
            aria-current={activeId === heading.id ? "true" : undefined}
            className={cn(
              "block rounded-md px-2 py-1 text-sm transition-colors",
              activeId === heading.id
                ? "bg-accent text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setOpen(false)}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  )

  if (variant === "collapsible") {
    return (
      <CollapsibleCard
        open={open}
        centeredTitle={false}
        className="mb-6"
        onToggle={setOpen}
      >
        {list}
      </CollapsibleCard>
    )
  }

  if (variant === "desktop-collapsible") {
    return (
      <CollapsibleCard open={open} centeredTitle onToggle={setOpen}>
        {list}
      </CollapsibleCard>
    )
  }

  return <nav aria-label="Table of contents">{list}</nav>
}
