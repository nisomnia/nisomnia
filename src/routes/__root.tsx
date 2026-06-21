"use client"

import type { QueryClient } from "@tanstack/react-query"

import { TanStackDevtools } from "@tanstack/react-devtools"
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import React from "react"

import { Header } from "@/components/layout/header"
import { AppSidebar } from "@/components/layout/sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { fetchClient } from "@/lib/api/client"
import TanStackQueryDevtools from "@/lib/query/devtools"
import { TanstackQueryProvider } from "@/lib/query/root-provider"
import { ThemeProvider } from "@/lib/theme/provider"
import appCss from "@/styles.css?url"

const LANGUAGE = "id"
const POPULAR_LIMIT = 8

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery({
      queryKey: ["topics", "popular", LANGUAGE, POPULAR_LIMIT],
      queryFn: () =>
        fetchClient
          .POST("/topic/by-article-count", {
            body: { language: LANGUAGE, perPage: POPULAR_LIMIT },
          })
          .then(({ data, error }) => {
            if (error) throw error
            return data ?? []
          }),
      staleTime: 5 * 60 * 1000,
    })
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TanStack Start Starter" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <link rel="stylesheet" href={appCss} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k="theme",s=null,t="light";try{s=localStorage.getItem(k)}catch(e){}if(s==="light"||s==="dark"){t=s}else if(window.matchMedia("(prefers-color-scheme: dark)").matches){t="dark"}document.documentElement.classList.add(t)})();`,
          }}
        />
      </head>
      <body>
        <TanstackQueryProvider queryClient={queryClient}>
          <ThemeProvider>
            <SidebarProvider defaultOpen>
              <AppSidebar />
              <SidebarInset>
                <Header />
                {children}
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
          <TanStackDevtools
            config={{ position: "bottom-right" }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </TanstackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
