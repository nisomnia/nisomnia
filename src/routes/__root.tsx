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

import { ErrorPage } from "@/components/layout/error-page"
import { Header } from "@/components/layout/header"
import { NotFound } from "@/components/layout/not-found"
import { AppSidebar } from "@/components/layout/sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { fetchClient } from "@/lib/api/client"
import TanStackQueryDevtools from "@/lib/query/devtools"
import { TanstackQueryProvider } from "@/lib/query/root-provider"
import { siteConfig } from "@/lib/seo/config"
import {
  buildGraph,
  jsonLdScript,
  organizationJsonLd,
  placeJsonLd,
  websiteJsonLd,
} from "@/lib/seo/json-ld"
import { ThemeProvider } from "@/lib/theme/provider"
import appCss from "@/styles.css?inline"

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
      { name: "theme-color", content: "#ffffff" },
      { name: "msapplication-config", content: "/icons/browserconfig.xml" },
      { title: siteConfig.siteName },
      { name: "description", content: siteConfig.siteDescription },
      {
        name: "robots",
        content:
          "follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large",
      },
      { property: "og:locale", content: siteConfig.defaultLocale },
      { property: "og:locale:alternate", content: siteConfig.alternateLocale },
      { property: "og:type", content: "website" },
      { property: "og:title", content: siteConfig.siteName },
      { property: "og:description", content: siteConfig.siteDescription },
      { property: "og:url", content: siteConfig.siteUrl },
      { property: "og:site_name", content: siteConfig.siteName },
      {
        property: "og:image",
        content: `${siteConfig.siteUrl}/images/cover.png`,
      },
      { name: "twitter:card", content: siteConfig.twitter.card },
      { name: "twitter:title", content: siteConfig.siteName },
      { name: "twitter:description", content: siteConfig.siteDescription },
      { name: "twitter:site", content: siteConfig.twitter.site },
      {
        name: "twitter:image",
        content: `${siteConfig.siteUrl}/images/cover.png`,
      },
    ],
    links: [
      { rel: "icon", type: "image/x-icon", href: "/icons/favicon.ico" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/icons/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/icons/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/icons/favicon-96x96.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "57x57",
        href: "/icons/apple-icon-57x57.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "60x60",
        href: "/icons/apple-icon-60x60.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "72x72",
        href: "/icons/apple-icon-72x72.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "76x76",
        href: "/icons/apple-icon-76x76.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "114x114",
        href: "/icons/apple-icon-114x114.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "120x120",
        href: "/icons/apple-icon-120x120.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "144x144",
        href: "/icons/apple-icon-144x144.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "152x152",
        href: "/icons/apple-icon-152x152.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/icons/apple-icon-180x180.png",
      },
      { rel: "apple-touch-icon", href: "/icons/apple-icon.png" },
      { rel: "manifest", href: "/icons/manifest.json" },
    ],
    scripts: [
      jsonLdScript(
        buildGraph([placeJsonLd(), organizationJsonLd(), websiteJsonLd()]),
      ),
      ...(import.meta.env.NODE_ENV === "production"
        ? [
            {
              src: "https://www.googletagmanager.com/gtag/js?id=G-0JB3NXP0QW",
              async: true,
              defer: true,
            },
            {
              children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments)}
gtag("js", new Date())
gtag("config", "G-0JB3NXP0QW")`,
            },
            {
              src: "https://analytics.yopem.com/script.js",
              async: true,
              "data-website-id": "dc9d1fa0-9691-48c7-83cd-1c79e16a80ca",
            },
            {
              src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4946821479056257",
              async: true,
              crossOrigin: "anonymous" as const,
            },
          ]
        : []),
    ],
  }),
  notFoundComponent: NotFound,
  errorComponent: ({ reset }) => <ErrorPage onReset={reset} />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext()

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <HeadContent />
        <style dangerouslySetInnerHTML={{ __html: appCss }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k="theme",s=null,t="light";try{s=localStorage.getItem(k)}catch(e){}if(s==="light"||s==="dark"){t=s}else if(window.matchMedia("(prefers-color-scheme: dark)").matches){t="dark"}document.documentElement.classList.add(t)})();`,
          }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="bg-primary text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        >
          Lewati ke konten utama
        </a>
        <TanstackQueryProvider queryClient={queryClient}>
          <ThemeProvider>
            <SidebarProvider defaultOpen>
              <AppSidebar />
              <SidebarInset id="main-content">
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
