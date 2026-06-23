import { defineHandler } from "nitro"

import { env } from "@/lib/env"
import { clearImageCache } from "@/lib/image/optimizer"

function unauthorized(): Response {
  return new Response("Unauthorized", {
    status: 401,
    headers: { "Content-Type": "text/plain" },
  })
}

export default defineHandler(async (event) => {
  if (event.req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { "Content-Type": "text/plain" },
    })
  }

  const secret = env.CACHE_CLEAR_SECRET
  if (!secret) {
    return new Response("Cache clearing is not configured", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    })
  }

  const authHeader = event.req.headers.get("authorization")
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined

  if (!token || token !== secret) {
    return unauthorized()
  }

  const count = await clearImageCache()

  return Response.json({
    success: true,
    cleared: count,
  })
})
