import { and, count, eq } from "drizzle-orm"

import { db } from "@/server/db"
import {
  articleAuthorsTable,
  articleEditorsTable,
  articlesTable,
  articleTopicsTable,
  topicsTable,
  usersTable,
  type ArticleWithRelations,
  type LanguageType,
  type SelectArticle,
} from "@/server/db/schema"
import { getCache, setCache } from "@/utils/redis"

export const getArticleBySlug = async (
  slug: string,
): Promise<ArticleWithRelations | undefined> => {
  const cacheKey = `article:slug:${slug}`

  // Try to get from cache first
  const cached = await getCache<ArticleWithRelations>(cacheKey)
  if (cached) {
    return cached
  }

  const articleData = await db.query.articlesTable.findFirst({
    where: (articles, { eq }) => eq(articles.slug, slug),
  })

  if (articleData) {
    const articleTopicsData = await db
      .select({
        id: topicsTable.id,
        title: topicsTable.title,
        slug: topicsTable.slug,
      })
      .from(articleTopicsTable)
      .leftJoin(
        articlesTable,
        eq(articleTopicsTable.articleId, articlesTable.id),
      )
      .leftJoin(topicsTable, eq(articleTopicsTable.topicId, topicsTable.id))
      .where(eq(articlesTable.id, articleData.id))

    const articleAuthorsData = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
      })
      .from(articleAuthorsTable)
      .leftJoin(
        articlesTable,
        eq(articleAuthorsTable.articleId, articlesTable.id),
      )
      .leftJoin(usersTable, eq(articleAuthorsTable.userId, usersTable.id))
      .where(eq(articlesTable.id, articleData.id))

    const articleEditorsData = await db
      .select({ id: usersTable.id, name: usersTable.name })
      .from(articleEditorsTable)
      .leftJoin(
        articlesTable,
        eq(articleEditorsTable.articleId, articlesTable.id),
      )
      .leftJoin(usersTable, eq(articleEditorsTable.userId, usersTable.id))
      .where(eq(articlesTable.id, articleData.id))

    const data = {
      ...articleData,
      topics: articleTopicsData,
      authors: articleAuthorsData,
      editors: articleEditorsData,
    }

    // Cache the result for 1 hour
    await setCache(cacheKey, data, 3600)

    return data
  }
}

export const getArticlesByLanguage = async ({
  language,
  page,
  perPage,
}: {
  language: LanguageType
  page: number
  perPage: number
}): Promise<SelectArticle[]> => {
  const cacheKey = `articles:lang:${language}:page:${page}:per:${perPage}`

  // Try to get from cache first
  const cached = await getCache<SelectArticle[]>(cacheKey)
  if (cached) {
    return cached
  }

  const articles = await db.query.articlesTable.findMany({
    where: (articles, { eq, and }) =>
      and(eq(articles.language, language), eq(articles.status, "published")),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
  })

  // Cache for 30 minutes
  await setCache(cacheKey, articles, 1800)

  return articles
}

export const getRelatedArticles = async ({
  currentArticleId,
  topicId,
  language,
  limit,
}: {
  currentArticleId: string
  topicId: string
  language: LanguageType
  limit: number
}): Promise<SelectArticle[]> => {
  const articles = await db.query.articlesTable.findMany({
    where: (articles, { eq, and, not, inArray }) =>
      and(
        eq(articles.language, language),
        eq(articles.status, "published"),
        not(eq(articles.id, currentArticleId)),
        inArray(
          articles.id,
          db
            .select({ id: articleTopicsTable.articleId })
            .from(articleTopicsTable)
            .where(eq(articleTopicsTable.topicId, topicId)),
        ),
      ),
    limit: limit,
    orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
    with: {
      topics: true,
    },
  })

  return articles.filter((article) =>
    article.topics.some((topic) => topic.topicId === topicId),
  )
}

export const getArticlesByTopicId = async ({
  topicId,
  language,
  page,
  perPage,
}: {
  topicId: string
  language: LanguageType
  page: number
  perPage: number
}) => {
  const articles = await db.query.articlesTable.findMany({
    where: (articles, { eq, and, inArray }) =>
      and(
        eq(articles.language, language),
        eq(articles.status, "published"),
        inArray(
          articles.id,
          db
            .select({ id: articleTopicsTable.articleId })
            .from(articleTopicsTable)
            .where(eq(articleTopicsTable.topicId, topicId)),
        ),
      ),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
    with: {
      topics: true,
    },
  })

  return articles.filter((article) =>
    article.topics.some((topic) => topic.topicId === topicId),
  )
}

export const getArticlesByUserId = async ({
  userId,
  language,
  page,
  perPage,
}: {
  userId: string
  language: LanguageType
  page: number
  perPage: number
}) => {
  const articles = await db.query.articlesTable.findMany({
    where: (articles, { eq, and, inArray }) =>
      and(
        eq(articles.language, language),
        eq(articles.status, "published"),
        inArray(
          articles.id,
          db
            .select({ id: articleAuthorsTable.articleId })
            .from(articleAuthorsTable)
            .where(eq(articleAuthorsTable.userId, userId)),
        ),
      ),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
    with: {
      authors: true,
    },
  })

  return articles.filter((article) =>
    article.authors.some((author) => author.userId === userId),
  )
}

export const getArticlesSitemap = async ({
  language,
  page,
  perPage,
}: {
  language: LanguageType
  page: number
  perPage: number
}) => {
  return await db.query.articlesTable.findMany({
    where: (articles, { eq, and }) =>
      and(eq(articles.language, language), eq(articles.status, "published")),
    columns: {
      slug: true,
      updatedAt: true,
    },
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
  })
}

export const getArticlesCount = async () => {
  const data = await db
    .select({ count: count() })
    .from(articlesTable)
    .where(and(eq(articlesTable.status, "published")))

  return data[0].count
}

export const getArticlesCountByLanguage = async (language: LanguageType) => {
  const data = await db
    .select({ count: count() })
    .from(articlesTable)
    .where(
      and(
        eq(articlesTable.language, language),
        eq(articlesTable.status, "published"),
      ),
    )

  return data[0].count
}

export const getArticlesCountByTopicId = async (topicId: string) => {
  const data = await db
    .select({ count: count() })
    .from(articlesTable)
    .innerJoin(
      articleTopicsTable,
      eq(articlesTable.id, articleTopicsTable.articleId),
    )
    .where(
      and(
        eq(articlesTable.status, "published"),
        eq(articleTopicsTable.topicId, topicId),
      ),
    )

  return data[0].count
}

export const getArticlesCountByUserId = async (userId: string) => {
  const data = await db
    .select({ count: count() })
    .from(articlesTable)
    .innerJoin(
      articleAuthorsTable,
      eq(articlesTable.id, articleAuthorsTable.articleId),
    )
    .where(
      and(
        eq(articlesTable.status, "published"),
        eq(articleAuthorsTable.userId, userId),
      ),
    )

  return data[0].count
}

export const searchArticles = async ({
  language,
  searchQuery,
  limit,
}: {
  language: LanguageType
  searchQuery: string
  limit: number
}) => {
  return await db.query.articlesTable.findMany({
    where: (articles, { eq, and, or, ilike }) =>
      and(
        eq(articles.language, language),
        eq(articles.status, "published"),
        or(
          ilike(articles.title, `%${searchQuery}%`),
          ilike(articles.slug, `%${searchQuery}%`),
        ),
      ),
    orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
    limit: limit,
  })
}
