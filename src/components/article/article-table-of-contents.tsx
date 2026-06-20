"use client"

import { ChevronDownIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils/style"

interface ArticleTableOfContentsProps {
  headings: {
    id: string
    text: string
    level: number
  }[]
  variant?: "sidebar" | "collapsible" | "desktop-collapsible"
}

export function ArticleTableOfContents({
  headings,
  variant = "sidebar",
}: ArticleTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [open, setOpen] = useState(variant !== "collapsible")

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.id)

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
    <ul className="flex flex-col gap-1">
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

  const mobileSummary = (
    <summary className="flex cursor-pointer items-center justify-between p-3 text-sm font-semibold select-none">
      Table of Contents
      <ChevronDownIcon
        className={cn("size-4 transition-transform", open && "rotate-180")}
      />
    </summary>
  )

  const desktopSummary = (
    <summary className="relative flex cursor-pointer items-center justify-center p-3 text-sm font-semibold select-none">
      <span className="px-6">Table of Contents</span>
      <ChevronDownIcon
        className={cn(
          "absolute right-3 size-4 transition-transform",
          open && "rotate-180",
        )}
      />
    </summary>
  )

  if (variant === "collapsible") {
    return (
      <details
        className="mb-6 rounded-lg border"
        onToggle={(e) => setOpen(e.currentTarget.open)}
      >
        {mobileSummary}
        <nav aria-label="Table of contents" className="border-t p-3 pt-2">
          {list}
        </nav>
      </details>
    )
  }

  if (variant === "desktop-collapsible") {
    return (
      <details
        className="rounded-lg border"
        open={open}
        onToggle={(e) => setOpen(e.currentTarget.open)}
      >
        {desktopSummary}
        <nav aria-label="Table of contents" className="border-t p-3 pt-2">
          {list}
        </nav>
      </details>
    )
  }

  return <nav aria-label="Table of contents">{list}</nav>
}
