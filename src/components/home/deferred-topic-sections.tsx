"use client"

import { useCallback, useState } from "react"

import { TopicSection } from "@/components/topic/topic-section"

interface DeferredTopicSectionsProps {
  topics: readonly { label: string; slug: string }[]
}

export function DeferredTopicSections({ topics }: DeferredTopicSectionsProps) {
  const [visible, setVisible] = useState(false)

  const observe = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || visible) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return
          setVisible(true)
          observer.disconnect()
        },
        { rootMargin: "0px 0px -25%" },
      )

      observer.observe(node)
      return () => observer.disconnect()
    },
    [visible],
  )

  if (!visible) return <div ref={observe} className="h-px" aria-hidden />

  return topics.map(({ label, slug }) => (
    <TopicSection key={slug} label={label} slug={slug} startIndex={1} />
  ))
}
