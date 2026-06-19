import createFetchClient from "openapi-fetch"
import createClient from "openapi-react-query"

import type { paths } from "./types"

const fetchClient = createFetchClient<paths>({
  baseUrl: import.meta.env.API_URL,
})

export const $api = createClient(fetchClient)
export { fetchClient }
