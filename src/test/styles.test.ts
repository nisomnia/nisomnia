import { readFileSync } from "node:fs"
import { expect, it } from "vitest"

it("limits Tailwind scanning to src even when Docker excludes .gitignore", () => {
  const styles = readFileSync("src/styles.css", "utf8")

  expect(styles).toMatch(/@import\s+"tailwindcss"\s+source\("\.\/"\)/)
})
