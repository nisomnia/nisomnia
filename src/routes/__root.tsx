"use client"

import type { QueryClient } from "@tanstack/react-query"

import { TanStackDevtools } from "@tanstack/react-devtools"
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import * as React from "react"

import { fetchClient } from "@/api/client"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import TanStackQueryDevtools from "@/lib/query/devtools"
import { TanstackQueryProvider } from "@/lib/query/root-provider"
import appCss from "@/styles.css?url"

const LANGUAGE = "id"
const POPULAR_LIMIT = 8

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    title: "TanStack Start Starter",
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
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
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TanstackQueryProvider queryClient={queryClient}>
          <div className="flex min-h-screen flex-col">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <div className="flex flex-1">
              <Sidebar
                mobileOpen={sidebarOpen}
                onMobileOpenChange={setSidebarOpen}
              />
              <main className="min-w-0 flex-1">{children}</main>
            </div>
          </div>
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
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
