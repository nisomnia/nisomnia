"use client"

import { Link, useRouterState } from "@tanstack/react-router"
import { FileTextIcon, HomeIcon, SearchIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePopularTopics } from "@/hooks/use-popular-topics"

const APP_TITLE =
  (import.meta.env.PUBLIC_APP_TITLE as string | undefined) ?? "Nisomnia"

function useActiveTopicSlug(): string | undefined {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const match = pathname.match(/^\/topic\/([^/]+)\/?/)
  return match?.[1]
}

function TopicMenu() {
  const topicsQuery = usePopularTopics()
  const topics = topicsQuery.data ?? []
  const activeSlug = useActiveTopicSlug()

  if (topics.length === 0) {
    return (
      <p className="text-muted-foreground px-2 text-sm">No topics found.</p>
    )
  }

  return (
    <>
      {topics.map((topic) => (
        <SidebarMenuItem key={topic.slug}>
          <SidebarMenuButton
            isActive={topic.slug === activeSlug}
            render={<Link params={{ slug: topic.slug }} to="/topic/$slug" />}
          >
            {topic.title}
          </SidebarMenuButton>
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
        <SidebarMenuButton isActive={pathname === "/"} render={<Link to="/" />}>
          <HomeIcon />
          <span>Home</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={pathname.startsWith("/article")}
          render={<Link to="/article" />}
        >
          <FileTextIcon />
          <span>Articles</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton render={<Link to="/article" search={{ q: "" }} />}>
          <SearchIcon />
          <span>Search</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" side="left">
      <SidebarHeader>
        <Link className="flex items-center gap-2 px-2" to="/">
          <img
            alt={APP_TITLE}
            className="size-8 rounded-md"
            src="/icons/android-icon-192x192.png"
          />
          <span className="font-heading text-lg font-semibold group-data-[collapsible=icon]:hidden">
            {APP_TITLE}
          </span>
        </Link>
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
