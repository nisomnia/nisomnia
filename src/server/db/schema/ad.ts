import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

import { createId } from "@/utils/cuid"

const AD_POSITION = [
  "home_below_header",
  "article_below_header",
  "topic_below_header",
  "single_article_above_content",
  "single_article_middle_content",
  "single_article_below_content",
  "single_article_pop_up",
  "article_below_header_amp",
  "single_article_above_content_amp",
  "single_article_middle_content_amp",
  "single_article_below_content_amp",
] as const
const AD_TYPE = ["plain_ad", "adsense"] as const

export const adPosition = z.enum(AD_POSITION)
export const adType = z.enum(AD_TYPE)

export const adPositionEnum = pgEnum("ad_position", AD_POSITION)
export const adTypeEnum = pgEnum("ad_type", AD_TYPE)

export const adsTable = pgTable("ads", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").unique().notNull(),
  content: text("content").notNull(),
  position: adPositionEnum("position").notNull().default("home_below_header"),
  type: adTypeEnum("type").notNull().default("plain_ad"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertAdSchema = createInsertSchema(adsTable)
export const updateAdSchema = createUpdateSchema(adsTable)

export type SelectAd = typeof adsTable.$inferSelect

export type AdPosition = z.infer<typeof adPosition>
export type AdType = z.infer<typeof adType>
