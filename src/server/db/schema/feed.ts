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

export const FEED_TYPE = ["website", "tiktok", "x", "facebook"] as const

export const feedType = z.enum(FEED_TYPE)

export const feedTypeEnum = pgEnum("feed_type", FEED_TYPE)

export const feedsTable = pgTable("feeds", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  language: languageEnum("language").notNull().default("id"),
  featuredImage: text("featured_image"),
  link: text("link"),
  type: feedTypeEnum("type").notNull().default("website"),
  owner: text("owner"),
  status: statusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const feedsRelations = relations(feedsTable, ({ many }) => ({
  topics: many(feedTopicsTable),
}))

export const feedTopicsTable = pgTable(
  "_feed_topics",
  {
    feedId: text("feed_id")
      .notNull()
      .references(() => feedsTable.id),
    topicId: text("topic_id")
      .notNull()
      .references(() => topicsTable.id),
  },
  (t) => [
    primaryKey({
      columns: [t.feedId, t.topicId],
    }),
  ],
)

export const feedTopicsRelations = relations(feedTopicsTable, ({ one }) => ({
  feed: one(feedsTable, {
    fields: [feedTopicsTable.feedId],
    references: [feedsTable.id],
  }),
  topic: one(topicsTable, {
    fields: [feedTopicsTable.topicId],
    references: [topicsTable.id],
  }),
}))

export const insertFeedSchema = createInsertSchema(feedsTable)
export const updateFeedSchema = createUpdateSchema(feedsTable)

export type SelectFeed = typeof feedsTable.$inferSelect

export type FeedType = z.infer<typeof feedType>
