// @ts-check
import { defineConfig } from "astro/config"
import node from "@astrojs/node"
import tailwindcss from "@tailwindcss/vite"

import { port, publicSiteUrl } from "@/utils/constant"
import { redirects } from "./redirects.mjs"

export default defineConfig({
  site: publicSiteUrl ? publicSiteUrl : "http://localhost:4321",

  server: {
    port: port ? parseInt(port) : 4321,
    host: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      "Referrer-Policy": "origin-when-cross-origin",
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "X-DNS-Prefetch-Control": "on",
      "Strict-Transport-Security":
        "max-age=31536000; includeSubDomains; preload",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Accept-Encoding": "gzip, compress, br",
    },
  },

  output: "server",

  adapter: node({
    mode: "standalone",
  }),

  vite: {
    //@ts-ignore - tailwindcss is not typed correctly
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["path-to-regexp"],
    },
    preview: {
      port: port ? parseInt(port) : 4321,
      host: true,
    },
    build: {
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["astro", "@astrojs/node"],
            utils: ["@yopem-ui/utils", "@yopem/try-catch", "nanoid"],
            db: ["drizzle-orm", "drizzle-zod"],
            trpc: ["@trpc/client", "@trpc/server", "superjson"],
          },
        },
      },
    },
  },

  // @ts-expect-error - we need to define the type of the redirects if astro support config in typescript
  redirects: redirects,

  trailingSlash: "never",

  integrations: [],
})
