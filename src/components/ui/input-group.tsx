"use client"

import type { ComponentProps, MouseEvent } from "react"

import { cn } from "@/lib/utils/style"

export function InputGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative inline-flex h-8.5 w-full min-w-0 items-center rounded-lg border border-input bg-background text-foreground shadow-xs/5 transition-shadow has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring/24 sm:h-7.5",
        className,
      )}
      role="group"
      {...props}
    />
  )
}

export function InputGroupAddon({
  className,
  ...props
}: ComponentProps<"div">) {
  function focusInput(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button, a, input")) return
    event.preventDefault()
    event.currentTarget.parentElement?.querySelector("input")?.focus()
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center ps-3.5 text-muted-foreground [&_svg]:size-4",
        className,
      )}
      onMouseDown={focusInput}
      {...props}
    />
  )
}

export function InputGroupInput({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-full w-full min-w-0 rounded-[inherit] bg-transparent px-2 outline-none placeholder:text-muted-foreground/72",
        className,
      )}
      {...props}
    />
  )
}
