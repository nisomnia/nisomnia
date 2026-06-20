"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils/style"

interface ArticleTableOfContentsProps {
  headings: {
    id: string
    text: string
    level: number
  }[]
}

export function ArticleTableOfContents({
  headings,
}: ArticleTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

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

  return (
    <nav aria-label="Table of contents">
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
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
