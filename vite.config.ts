import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"

import { redirects } from "./redirects.ts"

const redirectRouteRules = Object.fromEntries(
  Object.entries(redirects).map(([path, { status, destination }]) => [
    path,
    { redirect: { to: destination, status } },
  ]),
)

const contentRouteRules = {
  "/": { swr: 300 },
  "/article": { swr: 300 },
  "/article/**": { swr: 300 },
  "/topic": { swr: 300 },
  "/topic/**": { swr: 300 },
}

const config = defineConfig({
  envPrefix: ["VITE_", "PUBLIC_"],
  build: { sourcemap: true },
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({
      preset: "bun",
      compressPublicAssets: { gzip: true, brotli: true },
      rollupConfig: { external: [/^@sentry\//, "isomorphic-dompurify"] },
      routeRules: { ...contentRouteRules, ...redirectRouteRules },
      scanDirs: ["src/server"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
