import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

vi.mock("@/hooks/use-media-query", () => ({ useMediaQuery: () => false }))

afterEach(cleanup)

it("keeps collapsed desktop navigation inert and exposes toggle state", () => {
  render(
    <SidebarProvider defaultOpen={false}>
      <SidebarTrigger />
      <Sidebar>
        <a href="/article">Artikel</a>
      </Sidebar>
    </SidebarProvider>,
  )
  const toggle = screen.getByRole("button", { name: "Toggle Sidebar" })
  const sidebar = screen.getByLabelText("Navigasi samping")
  expect(toggle.getAttribute("aria-expanded")).toBe("false")
  expect(sidebar.hasAttribute("inert")).toBe(true)
  fireEvent.click(toggle)
  expect(toggle.getAttribute("aria-expanded")).toBe("true")
  expect(sidebar.hasAttribute("inert")).toBe(false)
  fireEvent.click(toggle)
  expect(sidebar.hasAttribute("inert")).toBe(true)
})
