import type { ComponentProps } from "react"

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import { ArticleCard } from "@/components/article/article-card"

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    params,
    to,
    ...props
  }: ComponentProps<"a"> & { params: { slug: string }; to: string }) => (
    <a href={to.replace("$slug", params.slug)} {...props} />
  ),
}))

afterEach(cleanup)

it.each(["default", "compact", "spotlight"] as const)(
  "renders %s as an image-left article row",
  (variant) => {
    const { container } = render(
      <ArticleCard
        title="Cerita terbaru"
        slug="cerita-terbaru"
        excerpt="Ringkasan artikel."
        featuredImage="https://example.com/image.jpg"
        variant={variant}
      />,
    )
    const link = screen.getByRole("link")
    expect(link.getAttribute("href")).toBe("/article/cerita-terbaru")
    expect(link.classList.contains("article-row")).toBe(true)
    expect(
      link.firstElementChild?.classList.contains("article-row-image"),
    ).toBe(true)
    expect(link.lastElementChild?.classList.contains("article-row-copy")).toBe(
      true,
    )
    expect(container.querySelector("img")?.getAttribute("alt")).toBe("")
    expect(screen.getByRole("heading", { name: "Cerita terbaru" })).toBeTruthy()
    expect(screen.getByText("Ringkasan artikel.")).toBeTruthy()
  },
)

it("keeps image space and article link when image and excerpt are absent", () => {
  const { container } = render(
    <ArticleCard title="Tanpa gambar" slug="tanpa-gambar" />,
  )
  expect(container.querySelector(".article-row-image svg")).toBeTruthy()
  expect(container.querySelector(".article-row-excerpt")).toBeNull()
  expect(screen.getByRole("link").getAttribute("href")).toBe(
    "/article/tanpa-gambar",
  )
})
