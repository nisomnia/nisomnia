import { createFileRoute } from "@tanstack/react-router"

import { buildLlmsText, fetchContentIndex } from "@/lib/seo/content-index"

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const contentIndex = await fetchContentIndex()

        return new Response(buildLlmsText(contentIndex), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        })
      },
    },
  },
})
