import createFetchClient from "openapi-fetch"

import type { paths } from "./types"

const fetchClient = createFetchClient<paths>({
  baseUrl: import.meta.env.PUBLIC_API_URL,
})

export { fetchClient }
