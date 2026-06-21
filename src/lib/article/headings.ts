interface Heading {
  id: string
  text: string
  level: number
}

export function extractHeadings(html: string): {
  html: string
  headings: Heading[]
} {
  const headings: Heading[] = []
  const slugCounts = new Map<string, number>()

  const processedHtml = html.replace(
    /<h([1-6])[^>]*>(.*?)<\/h\1>/gi,
    (_match, level, innerHtml) => {
      const text = innerHtml.replace(/<[^>]+>/g, "").trim()
      let id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 50)

      const count = (slugCounts.get(id) ?? 0) + 1
      slugCounts.set(id, count)
      if (count > 1) {
        id = `${id}-${count}`
      }

      headings.push({ id, text, level: parseInt(level, 10) })
      return `<h${level} id="${id}">${innerHtml}</h${level}>`
    },
  )

  return { html: processedHtml, headings }
}
