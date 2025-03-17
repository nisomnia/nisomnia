import type { APIRoute } from "astro"

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /

Disallow: /?p=*
Disallow: /cdn-cgi/bm/cv/
Disallow: /cdn-cgi/challenge-platform/
Disallow: /cdn-cgi/zaraz/s.js?z=

User-agent: Nuclei
User-agent: WikiDo
User-agent: Riddler
User-agent: PetalBot
User-agent: Zoominfobot
User-agent: Go-http-client
User-agent: Node/simplecrawler
User-agent: CazoodleBot
User-agent: dotbot/1.0
User-agent: Gigabot
User-agent: Barkrowler
User-agent: BLEXBot
User-agent: magpie-crawler
Disallow: /

Sitemap: ${sitemapURL.href}
`

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site)
  return new Response(getRobotsTxt(sitemapURL), {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
