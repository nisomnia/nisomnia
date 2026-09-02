"use client"

import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils/style"

const APP_TITLE = import.meta.env.PUBLIC_APP_TITLE ?? "Nisomnia"

interface LogoProps {
  showText?: boolean
  className?: string
}

export function Logo({ showText = true, className }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label={`${APP_TITLE} home`}
      className={cn(
        "flex items-center gap-2 overflow-hidden rounded-lg outline-hidden focus-visible:ring-2",
        className,
      )}
    >
      <img
        src="/icons/favicon-96x96.png"
        alt=""
        className="size-8 shrink-0 rounded-md"
        height={32}
        width={32}
      />
      {showText && (
        <span className="truncate font-heading text-lg font-semibold">
          {APP_TITLE}
        </span>
      )}
    </Link>
  )
}
