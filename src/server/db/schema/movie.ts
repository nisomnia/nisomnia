import { relations } from "drizzle-orm"
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { createId } from "@/utils/cuid"
import { genresTable } from "./genre"
import { overviewsTable } from "./overview"
import { productionCompaniesTable } from "./production-company"
import { statusEnum } from "./status"

export const moviesTable = pgTable("movies", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  imdbId: text("imdb_id"),
  tmdbId: text("tmdb_id").notNull().unique(),
  title: text("title").notNull(),
  originalTitle: text("original_title"),
  tagline: text("tagline"),
  slug: text("slug").notNull().unique(),
  airingStatus: text("airing_status"),
  originCountry: text("origin_country"),
  originalLanguage: text("original_language").notNull(),
  spokenLanguages: text("spoken_languages"),
  releaseDate: text("release_date"),
  revenue: integer("revenue"),
  runtime: integer("runtime"),
  budget: integer("budget"),
  homepage: text("homepage"),
  backdrop: text("backdrop"),
  poster: text("poster"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  status: statusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const moviesRelations = relations(moviesTable, ({ many }) => ({
  overviews: many(movieOverviewsTable),
  genres: many(movieGenresTable),
  productionCompanies: many(movieProductionCompaniesTable),
}))

export const movieGenresTable = pgTable(
  "_movie_genres",
  {
    movieId: text("movie_id")
      .notNull()
      .references(() => moviesTable.id),
    genreId: text("genre_id")
      .notNull()
      .references(() => genresTable.id),
  },
  (t) => [
    primaryKey({
      columns: [t.movieId, t.genreId],
    }),
  ],
)

export const movieGenresRelations = relations(movieGenresTable, ({ one }) => ({
  movie: one(moviesTable, {
    fields: [movieGenresTable.movieId],
    references: [moviesTable.id],
  }),
  genre: one(genresTable, {
    fields: [movieGenresTable.genreId],
    references: [genresTable.id],
  }),
}))

export const movieOverviewsTable = pgTable(
  "_movie_overviews",
  {
    movieId: text("movie_id")
      .notNull()
      .references(() => moviesTable.id),
    overviewId: text("overview_id")
      .notNull()
      .references(() => overviewsTable.id),
  },
  (t) => [
    primaryKey({
      columns: [t.movieId, t.overviewId],
    }),
  ],
)

export const movieOverviewsRelations = relations(
  movieOverviewsTable,
  ({ one }) => ({
    movie: one(moviesTable, {
      fields: [movieOverviewsTable.movieId],
      references: [moviesTable.id],
    }),
    overview: one(overviewsTable, {
      fields: [movieOverviewsTable.overviewId],
      references: [overviewsTable.id],
    }),
  }),
)

export const movieProductionCompaniesTable = pgTable(
  "_movie_production_companies",
  {
    movieId: text("movie_id")
      .notNull()
      .references(() => moviesTable.id),
    productionCompanyId: text("production_company_id")
      .notNull()
      .references(() => productionCompaniesTable.id),
  },
  (t) => [
    primaryKey({
      columns: [t.movieId, t.productionCompanyId],
    }),
  ],
)

export const movieProductionCompaniesRelations = relations(
  movieProductionCompaniesTable,
  ({ one }) => ({
    movie: one(moviesTable, {
      fields: [movieProductionCompaniesTable.movieId],
      references: [moviesTable.id],
    }),
    productionCompany: one(productionCompaniesTable, {
      fields: [movieProductionCompaniesTable.productionCompanyId],
      references: [productionCompaniesTable.id],
    }),
  }),
)

export const insertMovieSchema = createInsertSchema(moviesTable)
export const updateMovieSchema = createUpdateSchema(moviesTable)

export type SelectMovie = typeof moviesTable.$inferSelect
