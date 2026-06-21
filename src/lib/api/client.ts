import createFetchClient from "openapi-fetch"

import { apiUrl } from "@/lib/env"

import type { paths } from "./types"

const fetchClient = createFetchClient<paths>({
  baseUrl: apiUrl,
})

export { fetchClient }
