import type { ComponentProps } from "react"

import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import { ArticleListPage } from "@/components/article/article-list-page"

const mocks = vi.hoisted(() => ({
  fetchNextPage: vi.fn(),
  refetch: vi.fn(),
}))

vi.mock("@tanstack/react-router", () => ({
  getRouteApi: () => ({ useSearch: () => ({}) }),
  Link: ({
    to,
    params,
    ...props
  }: ComponentProps<"a"> & { to: string; params: { slug: string } }) => (
    <a href={to.replace("$slug", params.slug)} {...props} />
  ),
}))

vi.mock("@/hooks/api/article", () => ({
  useArticleSearch: () => ({ data: [], isLoading: false, isError: false }),
  useArticlesByLanguageInfinite: () => ({
    data: {
      pages: [
        { articles: [{ id: "1", slug: "cerita", title: "Cerita tersimpan" }] },
      ],
    },
    isLoading: false,
    isError: true,
    isFetchNextPageError: true,
    isFetchingNextPage: false,
    hasNextPage: true,
    ...mocks,
  }),
}))

afterEach(cleanup)

it("retains loaded articles and retries the failed next page", () => {
  render(<ArticleListPage />)
  expect(screen.getByRole("link", { name: "Cerita tersimpan" })).toBeTruthy()
  expect(screen.getByRole("alert").textContent).toContain("berikutnya")
  fireEvent.click(screen.getByRole("button", { name: "Coba lagi" }))
  expect(mocks.fetchNextPage).toHaveBeenCalledOnce()
  expect(mocks.refetch).not.toHaveBeenCalled()
})
