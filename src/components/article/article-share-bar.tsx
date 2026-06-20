"use client"

import { MailIcon, MessageCircleIcon, Share2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"

export interface ArticleShareBarProps {
  url: string
  title: string
}

export function ArticleShareBar({ url, title }: ArticleShareBarProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className="flex flex-row items-center gap-3 lg:flex-col lg:justify-end">
      <Button
        variant="outline"
        size="icon"
        aria-label="Share on Facebook"
        onClick={() => {
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            "_blank",
          )
        }}
      >
        <Share2Icon className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        aria-label="Share via Email"
        onClick={() => {
          window.open(
            `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
            "_self",
          )
        }}
        className="hidden lg:inline-flex"
      >
        <MailIcon className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        aria-label="Share on WhatsApp"
        onClick={() => {
          window.open(
            `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            "_blank",
          )
        }}
        className="lg:hidden"
      >
        <MessageCircleIcon className="size-4" />
      </Button>
    </div>
  )
}
