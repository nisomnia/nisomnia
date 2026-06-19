import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    SERVER_URL: z.string().optional(),
  },

  clientPrefix: "PUBLIC_",

  client: {
    PUBLIC_APP_TITLE: z.string().min(1).optional(),
  },

  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
