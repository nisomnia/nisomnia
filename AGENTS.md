# AGENTS.md

## Build, Lint, and Test Commands

- **Build:** `bunx --bun astro build`
- **Dev server:** `bunx --bun astro dev`
- **Preview:** `bunx --bun astro preview --host 0.0.0.0`
- **Lint:** `eslint --ext .astro,.ts,.tsx,.js,.mjs ./src`
- **Lint (fix):** `eslint --ext .astro,.ts,.tsx,.js,.mjs ./src --fix`
- **Format check:**
  `prettier --check "**/*.{astro,ts,tsx,mts,js,jsx,mjs,json,md}"`
- **Format write:**
  `prettier --write "**/*.{astro,ts,tsx,mts,js,jsx,mjs,json,md}"`
- **Typecheck:** `tsc --noEmit`
- **Astro check:** `bunx --bun astro check`
- **Run a single test:** _(No test script found; add one if needed)_

## Code Style Guidelines

- **Formatting:** Use Prettier (see config: 2-space indent, 80-char line,
  trailing commas, bracket spacing).
- **Imports:** Use sorted imports; avoid relative imports like `../`, prefer
  `@/`.
- **TypeScript:** Prefer type-only imports, separate type imports.
- **Naming:** Use descriptive names; unused vars prefixed with `_` are allowed.
- **Error Handling:** Use explicit error handling; avoid unnecessary non-null
  assertions.
- **Linting:** Follow ESLint and TypeScript recommended rules.
- **Astro:** Astro files use Prettier and ESLint plugins.
- **Accessibility:** JSX/TSX files follow a11y lint rules.
- **Prose:** Markdown and docs should wrap prose at 80 chars.

_For more details, see `prettier.config.mjs` and `eslint.config.js`._
