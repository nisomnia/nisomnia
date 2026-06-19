import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    API_URL: z.string(),
  },

  clientPrefix: "PUBLIC_",

  client: {
    PUBLIC_APP_TITLE: z.string(),
  },

  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
