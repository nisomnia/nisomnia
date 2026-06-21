export const siteConfig = {
  siteUrl: "https://nisomnia.com",
  siteName: "Nisomnia",
  siteDescription:
    "Berita dan artikel terbaru seputar anime, game, manga, film, dan teknologi.",
  defaultLocale: "id_ID",
  alternateLocale: "en_US",
  inLanguage: "id",
  twitter: {
    card: "summary_large_image" as const,
    site: "@nisomnia",
    creator: "@nisomnia",
  },
  organization: {
    name: "Nisomnia",
    legalName: "Nisomnia",
    description:
      "Media online yang menyajikan berita dan artikel seputar anime, game, manga, film, dan teknologi.",
    logo: "https://nisomnia.com/icons/Apple-icon.png",
    foundingDate: "2024",
    numberOfEmployees: "1-10",
    sameAs: [
      "https://www.facebook.com/nisomnia",
      "https://twitter.com/nisomnia",
      "https://www.instagram.com/nisomnia",
      "https://www.youtube.com/@nisomnia",
    ],
    contactPoints: [
      {
        type: "ContactPoint" as const,
        contactType: "customer support",
        email: "hello@nisomnia.com",
      },
    ],
    location: {
      type: "Place" as const,
      name: "Indonesia",
    },
  },
  website: {
    alternateName: "Nisomnia Media",
  },
  publisher: {
    facebookUrl: "https://www.facebook.com/nisomnia",
  },
}

export const robotsConfig = {
  index:
    "follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large",
  noindex:
    "noindex, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large",
}
