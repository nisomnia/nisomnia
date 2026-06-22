import { createMiddleware, createStart } from "@tanstack/react-start"

const ALLOWED_ORIGINS = ["https://nisomnia.com", "https://www.nisomnia.com"]

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false
  return ALLOWED_ORIGINS.includes(origin)
}

const corsMiddleware = createMiddleware().server(async ({ next, request }) => {
  const origin = request.headers.get("Origin")
  const isAllowed = isAllowedOrigin(origin)

  if (request.method === "OPTIONS") {
    const headers = new Headers()
    if (isAllowed && origin) {
      headers.set("Access-Control-Allow-Origin", origin)
      headers.set("Access-Control-Allow-Credentials", "true")
    }
    headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    )
    headers.set(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
    )
    headers.set("Access-Control-Max-Age", "86400")
    return new Response(null, { status: 204, headers })
  }

  const result = await next()
  const response = result.response
  const headers = new Headers(response.headers)

  if (isAllowed && origin) {
    headers.set("Access-Control-Allow-Origin", origin)
    headers.set("Access-Control-Allow-Credentials", "true")
  }
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  )
  headers.set(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  )
  headers.set("Access-Control-Max-Age", "86400")

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
})

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [corsMiddleware],
  }
})
