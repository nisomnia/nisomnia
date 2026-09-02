"use client"

import type {
  ComponentProps,
  CSSProperties,
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react"

import { MenuIcon, XIcon } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils/style"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"

interface SidebarContextProps {
  open: boolean
  openMobile: boolean
  setOpenMobile: Dispatch<SetStateAction<boolean>>
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextProps | null>(null)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider")
  return context
}

export function SidebarProvider({
  defaultOpen = true,
  className,
  style,
  children,
  ...props
}: ComponentProps<"div"> & { defaultOpen?: boolean }) {
  const isMobile = useMediaQuery("max-md")
  const [open, setOpen] = useState(defaultOpen)
  const [openMobile, setOpenMobile] = useState(false)
  const toggleSidebar = useCallback(() => {
    if (isMobile) setOpenMobile((value) => !value)
    else setOpen((value) => !value)
  }, [isMobile])
  const value = useMemo(
    () => ({ open, openMobile, setOpenMobile, toggleSidebar }),
    [open, openMobile, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={value}>
      <div
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full bg-sidebar",
          className,
        )}
        data-sidebar-initialized
        data-slot="sidebar-wrapper"
        style={{ "--sidebar-width": SIDEBAR_WIDTH, ...style } as CSSProperties}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function Sidebar({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const isMobile = useMediaQuery("max-md")
  const { open, openMobile, setOpenMobile } = useSidebar()

  if (isMobile) {
    if (!openMobile) return null

    return (
      <dialog
        aria-label="Sidebar"
        className={cn(
          "fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-(--sidebar-width) max-w-none border-0 bg-sidebar p-0 text-sidebar-foreground backdrop:bg-black/50",
          className,
        )}
        onClose={() => setOpenMobile(false)}
        ref={(dialog) => {
          if (dialog && !dialog.open) dialog.showModal()
        }}
        style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE } as CSSProperties}
      >
        <Button
          aria-label="Close sidebar"
          className="absolute top-2 right-2 z-10"
          size="icon"
          variant="ghost"
          onClick={() => setOpenMobile(false)}
        >
          <XIcon />
        </Button>
        <div className="flex h-full w-full flex-col">{children}</div>
      </dialog>
    )
  }

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={open ? "expanded" : "collapsed"}
    >
      <div
        className="relative w-(--sidebar-width) bg-transparent transition-[width] duration-300 ease-out group-data-[state=collapsed]:w-0"
        data-slot="sidebar-gap"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-10 hidden h-svh w-(--sidebar-width) border-r bg-sidebar transition-[left] duration-300 ease-out group-data-[state=collapsed]:-left-(--sidebar-width) md:flex",
          className,
        )}
      >
        <div className="flex h-full w-full flex-col">{children}</div>
      </aside>
    </div>
  )
}

export function SidebarTrigger({
  className,
  ...props
}: ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      className={cn("size-7", className)}
      size="icon"
      variant="ghost"
      onClick={toggleSidebar}
      {...props}
    >
      <MenuIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

export function SidebarInset({ className, ...props }: ComponentProps<"main">) {
  return (
    <main
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background",
        className,
      )}
      data-slot="sidebar-inset"
      {...props}
    />
  )
}

export function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 p-2", className)} {...props} />
}

export function SidebarContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto",
        className,
      )}
      {...props}
    />
  )
}

export function SidebarGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
}

export function SidebarGroupLabel({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-8 shrink-0 items-center rounded-lg px-2 text-xs font-medium text-sidebar-foreground",
        className,
      )}
      {...props}
    />
  )
}

export function SidebarMenu({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

export function SidebarMenuItem({ className, ...props }: ComponentProps<"li">) {
  return <li className={cn("relative", className)} {...props} />
}
