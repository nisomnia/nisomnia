import { getRequestURL } from "h3"
import { defineHandler } from "nitro"

import { optimizeImageRequest } from "@/lib/image/optimizer"

export default defineHandler((event) => {
  return optimizeImageRequest(getRequestURL(event).href)
})
