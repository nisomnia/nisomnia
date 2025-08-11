# Nisomnia - Project Context for Qwen Code

## Project Overview

Nisomnia is an Astro-based web application, likely a content-driven site (potentially a blog or news platform) focused on technology, gaming, anime, and related topics, given the example articles and topics in the redirects. The project uses Bun as its package manager and runtime. It's built with Astro for server-side rendering, integrates Tailwind CSS for styling, uses Drizzle ORM for database interactions (PostgreSQL), and incorporates TRPC for API communication. SEO is managed via `astro-seo-meta` and `astro-seo-schema`.

Key features currently in development or planned include sitemaps, redirects, analytics (Partytown), Adsense integration, social media commenting, TMDB integration, and various SEO enhancements.

## Technology Stack

*   **Framework:** Astro 5
*   **Runtime/Package Manager:** Bun
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Database:** PostgreSQL (via Drizzle ORM)
*   **API:** TRPC
*   **Deployment:** Docker, Dokploy (implied by `docker-compose.yml`)
*   **SEO:** `astro-seo-meta`, `astro-seo-schema`
*   **Linting/Formatting:** ESLint, Prettier (with plugins for sorting imports and Tailwind)

## Building, Running, and Testing

*   **Development Server:** `bun run dev` (Starts the Astro dev server, likely on port 4321)
*   **Build:** `bun run build` (Creates a production build in the `dist` directory)
*   **Preview Build:** `bun run preview` or `bun run start` (Serves the production build locally)
*   **Type Checking:** `bun run typecheck` (Runs `tsc --noEmit`)
*   **Linting:** `bun run lint` (Runs ESLint), `bun run lint:fix` (Runs ESLint with auto-fix)
*   **Formatting:** `bun run format:check` (Checks formatting with Prettier), `bun run format:write` (Formats files with Prettier)
*   **Database (Drizzle):**
    *   `bun run db:check`: Check migrations
    *   `bun run db:generate`: Generate migrations
    *   `bun run db:migrate`: Apply migrations
    *   `bun run db:studio`: Open Drizzle Studio (DB admin UI)
    *   (Other `db:*` commands available in `package.json`)

## Development Conventions

*   **Language:** TypeScript is used throughout the project.
*   **Styling:** Tailwind CSS is the primary styling method. Configuration is likely in `tailwind.config.cjs` (not read, but implied by dependencies and vite config).
*   **Aliases:** The `@/*` alias maps to the `./src/*` directory (configured in `tsconfig.json`).
*   **Environment Variables:** Managed via `import.meta.env`. Defined in `src/env.d.ts` and loaded, likely from a `.env` file. Constants are imported from `@/utils/constant`.
*   **Linting & Formatting:**
    *   ESLint is configured for TypeScript, Astro, and JSX accessibility.
    *   Prettier is used for code formatting, with plugins for Astro, Tailwind, and import sorting.
    *   Imports are sorted using `@ianvs/prettier-plugin-sort-imports`.
    *   Relative imports (`../`) are discouraged in favor of the `@/` alias.
*   **Code Structure:** Follows a typical Astro project structure with `src/` for source code, `public/` for static assets, and `dist/` for builds. Database-related files are in `src/server/db/`.
*   **Docker:** A `Dockerfile` and `docker-compose.yml` are present, indicating Docker is used for deployment, potentially with Dokploy.

## Key Files and Directories

*   `package.json`: Defines dependencies, scripts, and project metadata.
*   `astro.config.mjs`: Main Astro configuration file.
*   `tsconfig.json`: TypeScript configuration.
*   `src/utils/constant.ts`: Centralizes environment variable access.
*   `src/env.d.ts`: TypeScript declarations for environment variables.
*   `redirects.mjs`: Defines URL redirects.
*   `drizzle.config.ts`: Drizzle ORM configuration.
*   `eslint.config.js`, `prettier.config.mjs`: Linting and formatting configurations.
*   `Dockerfile`, `docker-compose.yml`: Docker configuration for deployment.
*   `.env.example`: Example environment variable file.
*   `README.md`: Project description and initial TODOs.

## Usage

This context file (`GEMINI.md`) provides Qwen Code with essential information about the Nisomnia project, including its purpose, technologies, key commands, and development conventions. This allows Qwen Code to better understand and assist with tasks related to this codebase.