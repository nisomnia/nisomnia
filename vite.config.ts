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

const config = defineConfig({
  envPrefix: ["VITE_", "PUBLIC_"],
  build: { sourcemap: true },
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({
      preset: "bun",
      rollupConfig: { external: [/^@sentry\//, "isomorphic-dompurify"] },
      routeRules: redirectRouteRules,
      scanDirs: ["src/server"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
