"use client"

import {
  useInfiniteQuery,
  useQuery,
  type QueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query"

import type { operations } from "@/lib/api/types"

import { fetchClient } from "@/lib/api/client"

const DEFAULT_LANGUAGE = "id"
const DEFAULT_PAGE_SIZE = 20
const RELATED_PAGE_SIZE = 10

export type ArticleResponse =
  operations["articleBySlug"]["responses"][200]["content"]["application/json"]

export type ArticlesByTopicResponse =
  operations["articleByTopicId"]["responses"][200]["content"]["application/json"]

export type ArticlesByTopicItem = ArticlesByTopicResponse[number]["article"]

export type ArticlesByTopicIdInfiniteResponse =
  operations["articleByTopicIdInfinite"]["responses"][200]["content"]["application/json"]

export type ArticlesByLanguageInfiniteResponse =
  operations["articleByLanguageInfinite"]["responses"][200]["content"]["application/json"]

export type RelatedArticlesInfiniteResponse =
  operations["articleRelatedInfinite"]["responses"][200]["content"]["application/json"]

export type ArticleSearchResponse =
  operations["articleSearch"]["responses"][200]["content"]["application/json"]

export type ArticleSearchItem = ArticleSearchResponse[number]

type CursorParam = string | null

type ArticleBySlugOptions = Omit<
  UseQueryOptions<
    ArticleResponse,
    Error,
    ArticleResponse,
    ReturnType<typeof articleBySlugKey>
  >,
  "queryKey" | "queryFn"
>

export function articleBySlugKey(slug: string) {
  return ["article", "by-slug", slug] as const
}

export async function fetchArticleBySlug(
  slug: string,
): Promise<ArticleResponse> {
  const { data, error } = await fetchClient.GET("/article/by-slug/{slug}", {
    params: { path: { slug } },
  })
  if (error) throw error
  if (!data) throw new Error("Article not found")
  return data
}

export function prefetchArticleBySlug(queryClient: QueryClient, slug: string) {
  return queryClient.prefetchQuery({
    queryKey: articleBySlugKey(slug),
    queryFn: () => fetchArticleBySlug(slug),
    staleTime: 5 * 60 * 1000,
  })
}

export function useArticleBySlug(
  slug: string,
  options: ArticleBySlugOptions = {},
) {
  return useQuery({
    ...options,
    queryKey: articleBySlugKey(slug),
    queryFn: () => fetchArticleBySlug(slug),
    staleTime: 5 * 60 * 1000,
  })
}

type ArticlesByTopicIdOptions = Omit<
  UseQueryOptions<
    ArticlesByTopicResponse,
    Error,
    ArticlesByTopicResponse,
    ReturnType<typeof articlesByTopicIdKey>
  >,
  "queryKey" | "queryFn"
>

export function articlesByTopicIdKey(topicId: string, limit: number) {
  return ["articles", "by-topic-id", topicId, DEFAULT_LANGUAGE, limit] as const
}

export async function fetchArticlesByTopicId(
  topicId: string,
  limit: number,
): Promise<ArticlesByTopicResponse> {
  const { data, error } = await fetchClient.POST("/article/by-topic-id", {
    body: {
      topicId,
      language: DEFAULT_LANGUAGE,
      page: 1,
      perPage: limit,
    },
  })
  if (error) throw error
  return data ?? []
}

export function prefetchArticlesByTopicId(
  queryClient: QueryClient,
  topicId: string,
  limit: number,
) {
  return queryClient.prefetchQuery({
    queryKey: articlesByTopicIdKey(topicId, limit),
    queryFn: () => fetchArticlesByTopicId(topicId, limit),
    staleTime: 5 * 60 * 1000,
  })
}

export function useArticlesByTopicId(
  topicId: string | undefined,
  limit: number,
  options: ArticlesByTopicIdOptions = {},
) {
  return useQuery({
    ...options,
    enabled: Boolean(topicId),
    queryKey: articlesByTopicIdKey(topicId!, limit),
    queryFn: () => fetchArticlesByTopicId(topicId!, limit),
    staleTime: 5 * 60 * 1000,
  })
}

export function articlesByTopicIdInfiniteKey(
  topicId: string,
  pageSize: number,
) {
  return ["articles", "by-topic", topicId, DEFAULT_LANGUAGE, pageSize] as const
}

export async function fetchArticlesByTopicIdInfinite(
  topicId: string,
  pageSize: number,
  cursor: CursorParam,
): Promise<ArticlesByTopicIdInfiniteResponse> {
  const { data, error } = await fetchClient.POST(
    "/article/by-topic-id-infinite",
    {
      body: {
        topicId,
        language: DEFAULT_LANGUAGE,
        limit: pageSize,
        cursor,
      },
    },
  )
  if (error) throw error
  if (!data) throw new Error("Failed to load articles")
  return data
}

export function useArticlesByTopicIdInfinite(
  topicId: string | undefined,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  return useInfiniteQuery({
    enabled: Boolean(topicId),
    queryKey: articlesByTopicIdInfiniteKey(topicId!, pageSize),
    queryFn: ({ pageParam }) =>
      fetchArticlesByTopicIdInfinite(topicId!, pageSize, pageParam),
    initialPageParam: null as CursorParam,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })
}

export function articlesByLanguageInfiniteKey(pageSize: number) {
  return ["articles", "by-language", DEFAULT_LANGUAGE, pageSize] as const
}

export async function fetchArticlesByLanguageInfinite(
  pageSize: number,
  cursor: CursorParam,
): Promise<ArticlesByLanguageInfiniteResponse> {
  const { data, error } = await fetchClient.POST(
    "/article/by-language-infinite",
    {
      body: {
        language: DEFAULT_LANGUAGE,
        limit: pageSize,
        cursor,
      },
    },
  )
  if (error) throw error
  if (!data) throw new Error("Failed to load articles")
  return data
}

export function useArticlesByLanguageInfinite(pageSize = DEFAULT_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: articlesByLanguageInfiniteKey(pageSize),
    queryFn: ({ pageParam }) =>
      fetchArticlesByLanguageInfinite(pageSize, pageParam),
    initialPageParam: null as CursorParam,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })
}

export function articleSearchKey(searchQuery: string | undefined) {
  return ["articles", "search", DEFAULT_LANGUAGE, searchQuery] as const
}

export async function fetchArticleSearch(
  searchQuery: string,
  limit: number,
): Promise<ArticleSearchResponse> {
  const { data, error } = await fetchClient.POST("/article/search", {
    body: { language: DEFAULT_LANGUAGE, limit, searchQuery },
  })
  if (error) throw error
  return data ?? []
}

export function useArticleSearch(
  searchQuery: string | undefined,
  limit = DEFAULT_PAGE_SIZE,
) {
  return useQuery({
    enabled: Boolean(searchQuery),
    queryKey: articleSearchKey(searchQuery),
    queryFn: () => fetchArticleSearch(searchQuery!, limit),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })
}

export function relatedArticlesInfiniteKey(
  currentArticleId: string,
  topicId: string,
  pageSize: number,
) {
  return ["articles", "related", currentArticleId, topicId, pageSize] as const
}

export async function fetchRelatedArticlesInfinite(
  currentArticleId: string,
  topicId: string,
  pageSize: number,
  cursor: CursorParam,
): Promise<RelatedArticlesInfiniteResponse> {
  const { data, error } = await fetchClient.POST("/article/related-infinite", {
    body: {
      currentArticleId,
      topicId,
      language: DEFAULT_LANGUAGE,
      limit: pageSize,
      cursor,
    },
  })
  if (error) throw error
  if (!data) throw new Error("Failed to load related articles")
  return data
}

export function useRelatedArticlesInfinite(
  currentArticleId: string | undefined,
  topicId: string | undefined,
  pageSize = RELATED_PAGE_SIZE,
) {
  return useInfiniteQuery({
    enabled: Boolean(currentArticleId) && Boolean(topicId),
    queryKey: relatedArticlesInfiniteKey(currentArticleId!, topicId!, pageSize),
    queryFn: ({ pageParam }) =>
      fetchRelatedArticlesInfinite(
        currentArticleId!,
        topicId!,
        pageSize,
        pageParam,
      ),
    initialPageParam: null as CursorParam,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })
}
