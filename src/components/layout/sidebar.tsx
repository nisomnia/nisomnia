"use client"

import { Link, useRouterState } from "@tanstack/react-router"
import { FileTextIcon, HashIcon, HomeIcon, SearchIcon } from "lucide-react"

import { Logo } from "@/components/layout/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTopicsByArticleCount } from "@/hooks/api/topic"
import { cn } from "@/lib/utils/style"

const MENU_LINK_CLASS_NAME =
  "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&_svg]:size-4 [&_svg]:shrink-0"

function menuLinkClassName(isActive: boolean) {
  return cn(
    MENU_LINK_CLASS_NAME,
    isActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
  )
}

function useActiveTopicSlug(): string | undefined {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const match = pathname.match(/^\/topic\/([^/]+)\/?/)
  return match?.[1]
}

function TopicMenu() {
  const { setOpenMobile } = useSidebar()
  const { data, isLoading, isError } = useTopicsByArticleCount({ perPage: 8 })
  const topics = data ?? []
  const activeSlug = useActiveTopicSlug()

  if (topics.length === 0) {
    return (
      <SidebarMenuItem>
        <p role="status" className="px-3 py-2 text-sm text-muted-foreground">
          {isLoading
            ? "Memuat topik..."
            : isError
              ? "Topik belum tersedia."
              : "Belum ada topik."}
        </p>
      </SidebarMenuItem>
    )
  }

  return (
    <>
      {topics.map((topic: { slug: string; title: string }) => (
        <SidebarMenuItem key={topic.slug}>
          <Link
            onClick={() => setOpenMobile(false)}
            className={menuLinkClassName(topic.slug === activeSlug)}
            aria-current={topic.slug === activeSlug ? "page" : undefined}
            params={{ slug: topic.slug }}
            to="/topic/$slug"
          >
            {topic.title}
          </Link>
        </SidebarMenuItem>
      ))}
    </>
  )
}

function MainNav() {
  const { setOpenMobile } = useSidebar()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link
          onClick={() => setOpenMobile(false)}
          activeOptions={{ exact: true }}
          className={menuLinkClassName(pathname === "/")}
          to="/"
        >
          <HomeIcon />
          <span>Beranda</span>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <Link
          onClick={() => setOpenMobile(false)}
          className={menuLinkClassName(pathname.startsWith("/article"))}
          to="/article"
        >
          <FileTextIcon />
          <span>Artikel</span>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <Link
          onClick={() => setOpenMobile(false)}
          className={MENU_LINK_CLASS_NAME}
          search={{ q: "" }}
          to="/article"
        >
          <SearchIcon />
          <span>Cari artikel</span>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <Link
          onClick={() => setOpenMobile(false)}
          className={menuLinkClassName(pathname.startsWith("/topic"))}
          to="/topic"
        >
          <HashIcon />
          <span>Topik</span>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <Logo showText className="pr-10 pl-2 text-primary" />
      </SidebarHeader>
      <SidebarContent className="px-3 pb-6">
        <SidebarGroup>
          <MainNav />
        </SidebarGroup>
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Topik populer</SidebarGroupLabel>
          <SidebarMenu>
            <TopicMenu />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
