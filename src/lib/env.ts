import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  clientPrefix: "PUBLIC_",

  client: {
    PUBLIC_API_URL: z.string(),
    PUBLIC_APP_TITLE: z.string(),
  },

  server: {
    CACHE_CLEAR_SECRET: z.string().optional(),
  },

  runtimeEnv: { ...import.meta.env, ...process.env },
  emptyStringAsUndefined: true,
})

export const apiUrl = env.PUBLIC_API_URL
export const apaiTitle = env.PUBLIC_APP_TITLE
