import { relations } from "drizzle-orm"
import {
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

import { createId } from "@/utils/cuid"
import { languageEnum } from "./language"
import { statusEnum } from "./status"
import { topicsTable } from "./topic"
import { usersTable } from "./user"

export const ARTICLE_VISIBILITY = ["public", "member"] as const

export const articleVisibility = z.enum(ARTICLE_VISIBILITY)

export const articleVisibilityEnum = pgEnum(
  "article_visibility",
  ARTICLE_VISIBILITY,
)

export const articleTranslationsTable = pgTable("article_translations", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const articlesTable = pgTable("articles", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  language: languageEnum("language").notNull().default("id"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  status: statusEnum("status").notNull().default("draft"),
  visibility: articleVisibilityEnum("visibility").notNull().default("public"),
  articleTranslationId: text("article_translation_id")
    .notNull()
    .references(() => articleTranslationsTable.id),
  featuredImage: text("featured_image").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const articlesRelations = relations(articlesTable, ({ one, many }) => ({
  articleTranslation: one(articleTranslationsTable, {
    fields: [articlesTable.articleTranslationId],
    references: [articleTranslationsTable.id],
  }),
  topics: many(articleTopicsTable),
  authors: many(articleAuthorsTable),
  editors: many(articleEditorsTable),
}))

export const articleTranslationsRelations = relations(
  articleTranslationsTable,
  ({ many }) => ({
    articles: many(articlesTable),
  }),
)

export const articleAuthorsTable = pgTable(
  "_article_authors",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => articlesTable.id),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id),
  },
  (t) => [
    primaryKey({
      columns: [t.articleId, t.userId],
    }),
  ],
)

export const articleAuthorsRelations = relations(
  articleAuthorsTable,
  ({ one }) => ({
    article: one(articlesTable, {
      fields: [articleAuthorsTable.articleId],
      references: [articlesTable.id],
    }),
    user: one(usersTable, {
      fields: [articleAuthorsTable.userId],
      references: [usersTable.id],
    }),
  }),
)

export const articleEditorsTable = pgTable(
  "_article_editors",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => articlesTable.id),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id),
  },
  (t) => [
    primaryKey({
      columns: [t.articleId, t.userId],
    }),
  ],
)

export const articleEditorsRelations = relations(
  articleEditorsTable,
  ({ one }) => ({
    article: one(articlesTable, {
      fields: [articleEditorsTable.articleId],
      references: [articlesTable.id],
    }),
    user: one(usersTable, {
      fields: [articleEditorsTable.userId],
      references: [usersTable.id],
    }),
  }),
)

export const articleTopicsTable = pgTable(
  "_article_topics",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => articlesTable.id),
    topicId: text("topic_id")
      .notNull()
      .references(() => topicsTable.id),
  },
  (t) => [
    primaryKey({
      columns: [t.articleId, t.topicId],
    }),
  ],
)

export const articleTopicsRelations = relations(
  articleTopicsTable,
  ({ one }) => ({
    article: one(articlesTable, {
      fields: [articleTopicsTable.articleId],
      references: [articlesTable.id],
    }),
    topic: one(topicsTable, {
      fields: [articleTopicsTable.topicId],
      references: [topicsTable.id],
    }),
  }),
)

export const insertArticleSchema = createInsertSchema(articlesTable)
export const updateArticleSchema = createUpdateSchema(articlesTable)
export const insertArticleTranslationSchema = createInsertSchema(
  articleTranslationsTable,
)

export type SelectArticle = typeof articlesTable.$inferSelect
export type SelectArticleTranslation =
  typeof articleTranslationsTable.$inferSelect

export type ArticleWithRelations = SelectArticle & {
  topics: { id: string | null; title: string | null; slug: string | null }[]
  authors: { id: string | null; name: string | null; username: string | null }[]
  editors: { id: string | null; name: string | null }[]
}

export type articleVisibility = z.infer<typeof articleVisibility>
