FROM docker.io/oven/bun:alpine AS base
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache git
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

FROM base AS build

ARG PUBLIC_API_URL
ARG PUBLIC_APP_TITLE
ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_APP_TITLE=$PUBLIC_APP_TITLE

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run generate-routes
RUN bun run build

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

ARG PUBLIC_API_URL
ARG PUBLIC_APP_TITLE
ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_APP_TITLE=$PUBLIC_APP_TITLE

COPY --from=build /app/.output ./.output
EXPOSE 3000

CMD ["bun", "run", "./.output/server/index.mjs"]
