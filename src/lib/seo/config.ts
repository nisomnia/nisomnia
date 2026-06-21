export const siteConfig = {
  siteUrl: "https://nisomnia.com",
  siteName: "Nisomnia",
  siteDescription:
    "Nisomnia adalah media pop culture yang mengulas seputar geek culture, game, anime, manga, film, musik, tv, komik dan topik anti mainstream lainya.",
  defaultLocale: "id_ID",
  alternateLocale: "en_US",
  inLanguage: "id",
  twitter: {
    card: "summary_large_image" as const,
    site: "@nisomniadotcom",
    creator: "@nisomniadotcom",
  },
  organization: {
    name: "Nisomnia",
    legalName: "Nisomnia",
    description:
      "Nisomnia adalah media pop culture yang mengulas seputar geek culture, game, anime, manga, film, musik, tv, komik dan topik anti mainstream lainya.",
    logo: "https://nisomnia.com/images/logo-light.png",
    foundingDate: "2024",
    numberOfEmployees: "1-10",
    sameAs: [
      "https://www.facebook.com/nisomniadotcom",
      "https://twitter.com/nisomniadotcom",
      "https://www.instagram.com/nisomniadotcom",
      "https://www.youtube.com/@nisomniadotcom",
    ],
    contactPoints: [
      {
        type: "ContactPoint" as const,
        contactType: "business inquiries",
        email: "hello@nisomnia.com",
      },
    ],
    location: {
      type: "Place" as const,
      name: "Indonesia",
    },
  },
  website: {
    alternateName: "Nisomnia.com",
  },
  publisher: {
    facebookUrl: "https://www.facebook.com/nisomniadotcom",
  },
}

export const robotsConfig = {
  index:
    "follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large",
  noindex:
    "noindex, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large",
}
