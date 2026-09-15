import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"

import {
  YouTubeEmbed,
  YouTubeWatchPlayer,
} from "@/components/article/youtube-embed"

afterEach(cleanup)

it("renders the watch-page player immediately", () => {
  const { container } = render(
    <YouTubeWatchPlayer videoId="abc123" title="Cuplikan film" />,
  )
  expect(container.querySelector("iframe")?.getAttribute("src")).toBe(
    "https://www.youtube-nocookie.com/embed/abc123?rel=0",
  )
  expect(screen.getByTitle("Cuplikan film")).toBeTruthy()
})

it("loads the private player only after activation and preserves its title", () => {
  const { container } = render(
    <YouTubeEmbed videoId="abc123" title="Cuplikan film" />,
  )
  expect(container.querySelector("iframe")).toBeNull()
  fireEvent.click(
    screen.getByRole("button", { name: "Putar video: Cuplikan film" }),
  )
  const player = screen.getByTitle("Cuplikan film")
  expect(player.getAttribute("src")).toBe(
    "https://www.youtube-nocookie.com/embed/abc123?autoplay=1&rel=0",
  )
})

it("keeps playback available after every thumbnail fails", () => {
  const { container } = render(<YouTubeEmbed videoId="abc123" />)
  for (let index = 0; index < 4; index += 1) {
    fireEvent.error(container.querySelector("img")!)
  }
  expect(container.querySelector("img")).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: "Putar video YouTube" }))
  expect(screen.getByTitle("Video YouTube")).toBeTruthy()
})
