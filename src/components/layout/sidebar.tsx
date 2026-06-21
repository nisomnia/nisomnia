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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useTopicsByArticleCount } from "@/hooks/api/topic"

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
      <p className="text-muted-foreground px-2 text-sm">No topics found.</p>
    )
  }

  return (
    <>
      {topics.map((topic: { slug: string; title: string }) => (
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
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={pathname.startsWith("/topic")}
          render={<Link to="/topic" />}
        >
          <HashIcon />
          <span>Topics</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" side="left">
      <SidebarHeader>
        <Logo showText className="text-primary px-2" />
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
