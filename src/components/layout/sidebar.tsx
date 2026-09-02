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
} from "@/components/ui/sidebar"
import { useTopicsByArticleCount } from "@/hooks/api/topic"
import { cn } from "@/lib/utils/style"

const MENU_LINK_CLASS_NAME =
  "flex h-8 w-full items-center gap-2 overflow-hidden rounded-lg p-2 text-left text-sm outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2"

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
  const topicsQuery = useTopicsByArticleCount({ perPage: 8 })
  const topics = topicsQuery.data ?? []
  const activeSlug = useActiveTopicSlug()

  if (topics.length === 0) {
    return (
      <p className="px-2 text-sm text-muted-foreground">No topics found.</p>
    )
  }

  return (
    <>
      {topics.map((topic: { slug: string; title: string }) => (
        <SidebarMenuItem key={topic.slug}>
          <Link
            className={menuLinkClassName(topic.slug === activeSlug)}
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
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link className={menuLinkClassName(pathname === "/")} to="/">
          <HomeIcon />
          <span>Home</span>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <Link
          className={menuLinkClassName(pathname.startsWith("/article"))}
          to="/article"
        >
          <FileTextIcon />
          <span>Articles</span>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <Link className={MENU_LINK_CLASS_NAME} search={{ q: "" }} to="/article">
          <SearchIcon />
          <span>Search</span>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <Link
          className={menuLinkClassName(pathname.startsWith("/topic"))}
          to="/topic"
        >
          <HashIcon />
          <span>Topics</span>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Logo showText className="px-2 text-primary" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <MainNav />
        </SidebarGroup>
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Popular topics</SidebarGroupLabel>
          <SidebarMenu>
            <TopicMenu />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
