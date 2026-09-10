"use client"

import { CheckIcon, LinkIcon, MailIcon } from "lucide-react"
import { useState } from "react"

import { FacebookIcon } from "@/components/icons/facebook"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { XTwitterIcon } from "@/components/icons/x-twitter"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/style"

export interface ArticleShareBarProps {
  url: string
  title: string
  className?: string
}

export function ArticleShareBar({
  url,
  title,
  className,
}: ArticleShareBarProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setCopyError(false)
    } catch {
      setCopyError(true)
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
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
        aria-label={copied ? "Link tersalin" : "Salin link"}
        onClick={handleCopyLink}
      >
        {copied ? (
          <CheckIcon className="size-4 text-success-foreground" />
        ) : (
          <LinkIcon className="size-4" />
        )}
      </Button>
      <span role="status" className="text-xs text-muted-foreground">
        {copyError
          ? "Gagal menyalin. Salin alamat dari browser."
          : copied
            ? "Link tersalin"
            : ""}
      </span>
    </div>
  )
}
