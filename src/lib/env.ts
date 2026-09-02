const apiUrl = import.meta.env.PUBLIC_API_URL

if (!apiUrl) {
  throw new Error("PUBLIC_API_URL is required")
}

export { apiUrl }
