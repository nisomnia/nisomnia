"use client"

import { CheckIcon, LinkIcon, MailIcon } from "lucide-react"
import { useState } from "react"

import { FacebookIcon } from "@/components/icons/facebook"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { XTwitterIcon } from "@/components/icons/x-twitter"
import { Button } from "@/components/ui/button"

export interface ArticleShareBarProps {
  url: string
  title: string
}

export function ArticleShareBar({ url, title }: ArticleShareBarProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-row items-center gap-3 lg:flex-col lg:items-end lg:justify-start">
      <Button
        variant="outline"
        size="icon"
        aria-label="Share on Facebook"
        onClick={() =>
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            "_blank",
          )
        }
      >
        <FacebookIcon size={16} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        aria-label="Share on X"
        onClick={() =>
          window.open(
            `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            "_blank",
          )
        }
      >
        <XTwitterIcon size={16} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        aria-label="Share via Email"
        onClick={() =>
          window.open(
            `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
            "_self",
          )
        }
        className="hidden lg:inline-flex"
      >
        <MailIcon className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        aria-label="Share on WhatsApp"
        onClick={() =>
          window.open(
            `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            "_blank",
          )
        }
        className="lg:hidden"
      >
        <WhatsAppIcon size={16} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        aria-label="Copy link"
        onClick={handleCopyLink}
      >
        {copied ? (
          <CheckIcon className="size-4 text-green-500" />
        ) : (
          <LinkIcon className="size-4" />
        )}
      </Button>
    </div>
  )
}
