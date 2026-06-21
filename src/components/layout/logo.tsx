"use client"

import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils/style"

const APP_TITLE =
  (import.meta.env.PUBLIC_APP_TITLE as string | undefined) ?? "Nisomnia"

interface LogoProps {
  showText?: boolean
  className?: string
}

export function Logo({ showText = true, className }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn(
        "flex items-center gap-2 overflow-hidden rounded-lg outline-hidden focus-visible:ring-2",
        className,
      )}
    >
      <img
        src="/icons/android-icon-192x192.png"
        alt=""
        className="size-8 shrink-0 rounded-md"
        aria-hidden="true"
      />
      {showText && (
        <span className="font-heading truncate text-lg font-semibold">
          {APP_TITLE}
        </span>
      )}
    </Link>
  )
}
