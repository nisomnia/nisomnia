"use client"

import { Link } from "@tanstack/react-router"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetClose,
  SheetPopup,
  SheetTitle,
} from "@/components/ui/sheet"
import { usePopularTopics } from "@/hooks/use-popular-topics"

function TopicLinks() {
  const topicsQuery = usePopularTopics()
  const topics = topicsQuery.data ?? []

  if (topics.length === 0) {
    return (
      <p className="text-muted-foreground px-3 text-sm">No topics found.</p>
    )
  }

  return (
    <nav aria-label="Topics" className="flex flex-col gap-1">
      {topics.map((topic) => (
        <Button
          key={topic.slug}
          className="justify-start"
          render={<Link params={{ slug: topic.slug }} to="/topic/$slug" />}
          variant="ghost"
        >
          {topic.title}
        </Button>
      ))}
    </nav>
  )
}

export function Sidebar({
  mobileOpen,
  onMobileOpenChange,
}: {
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="bg-background sticky top-16 hidden h-[calc(100vh-4rem)] w-60 flex-col border-e md:flex">
        <ScrollArea className="flex-1 px-3 py-4">
          <p className="text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
            Popular topics
          </p>
          <TopicLinks />
        </ScrollArea>
      </aside>

      {/* Mobile sidebar sheet */}
      <Sheet onOpenChange={onMobileOpenChange} open={mobileOpen}>
        <SheetPopup
          className="w-[calc(100%-(--spacing(12)))] max-w-xs border-e"
          showCloseButton={false}
          side="left"
        >
          <div className="flex items-center justify-between p-4">
            <SheetTitle className="font-heading text-lg font-semibold">
              Topics
            </SheetTitle>
            <SheetClose render={<Button size="icon" variant="ghost" />}>
              <XIcon />
              <span className="sr-only">Close topics</span>
            </SheetClose>
          </div>
          <ScrollArea className="h-[calc(100%-3.5rem)] px-3 py-2">
            <TopicLinks />
          </ScrollArea>
        </SheetPopup>
      </Sheet>
    </>
  )
}
