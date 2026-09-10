import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import { TopicArticles } from "@/components/topic/topic-articles"

afterEach(cleanup)

const props = {
  articles: [],
  isLoading: false,
  isError: false,
  hasNextPage: true,
  isFetchingNextPage: false,
  fetchNextPage: vi.fn(),
  retry: vi.fn(),
}

it("announces loading without exposing decorative placeholders", () => {
  const { container } = render(<TopicArticles {...props} isLoading />)
  expect(screen.getByRole("status").textContent).toContain("Memuat artikel")
  expect(
    container.querySelectorAll('.article-row[aria-hidden="true"]').length,
  ).toBe(3)
})

it("offers retry after failure and disables duplicate page requests while fetching", () => {
  const { rerender } = render(<TopicArticles {...props} isError />)
  fireEvent.click(screen.getByRole("button", { name: "Coba lagi" }))
  expect(props.retry).toHaveBeenCalledOnce()
  expect(screen.queryByRole("button", { name: "Muat lebih banyak" })).toBeNull()
  rerender(<TopicArticles {...props} isFetchingNextPage />)
  expect(screen.getByRole("button").hasAttribute("disabled")).toBe(true)
})
