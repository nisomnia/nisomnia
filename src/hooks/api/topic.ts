"use client"

import {
  useQuery,
  type QueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query"

import type { operations } from "@/lib/api/types"

import { fetchClient } from "@/lib/api/client"

const DEFAULT_LANGUAGE = "id"

export type TopicResponse =
  operations["topicBySlug"]["responses"][200]["content"]["application/json"]

export type TopicsByArticleCountResponse =
  operations["topicByArticleCount"]["responses"][200]["content"]["application/json"]

export type TopicByArticleCountItem = TopicsByArticleCountResponse[number]

type TopicBySlugOptions = Omit<
  UseQueryOptions<
    TopicResponse,
    Error,
    TopicResponse,
    ReturnType<typeof topicBySlugKey>
  >,
  "queryKey" | "queryFn"
>

type TopicsByArticleCountOptions = Omit<
  UseQueryOptions<
    TopicsByArticleCountResponse,
    Error,
    TopicsByArticleCountResponse,
    ReturnType<typeof topicsByArticleCountKey>
  >,
  "queryKey" | "queryFn"
>

type ArticleLanguage = "id" | "en"

export interface TopicsByArticleCountParams {
  language?: ArticleLanguage
  page?: number
  perPage?: number
}

export function topicBySlugKey(slug: string) {
  return ["topic", "by-slug", slug] as const
}

export async function fetchTopicBySlug(slug: string): Promise<TopicResponse> {
  const { data, error } = await fetchClient.GET("/topic/by-slug/{slug}", {
    params: { path: { slug } },
  })
  if (error) throw error
  if (!data) throw new Error("Topic not found")
  return data
}

export function prefetchTopicBySlug(queryClient: QueryClient, slug: string) {
  return queryClient.prefetchQuery({
    queryKey: topicBySlugKey(slug),
    queryFn: () => fetchTopicBySlug(slug),
    staleTime: 5 * 60 * 1000,
  })
}

export function useTopicBySlug(slug: string, options: TopicBySlugOptions = {}) {
  return useQuery({
    ...options,
    queryKey: topicBySlugKey(slug),
    queryFn: () => fetchTopicBySlug(slug),
    staleTime: 5 * 60 * 1000,
  })
}

export function topicsByArticleCountKey(params: TopicsByArticleCountParams) {
  const { language = DEFAULT_LANGUAGE, page, perPage } = params
  return ["topics", "all", "by-article-count", language, page, perPage] as const
}

export async function fetchTopicsByArticleCount(
  params: TopicsByArticleCountParams,
): Promise<TopicsByArticleCountResponse> {
  const { data, error } = await fetchClient.POST("/topic/by-article-count", {
    body: {
      language: params.language ?? DEFAULT_LANGUAGE,
      page: params.page,
      perPage: params.perPage,
    },
  })
  if (error) throw error
  return data ?? []
}

export function prefetchTopicsByArticleCount(
  queryClient: QueryClient,
  params: TopicsByArticleCountParams,
) {
  return queryClient.prefetchQuery({
    queryKey: topicsByArticleCountKey(params),
    queryFn: () => fetchTopicsByArticleCount(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useTopicsByArticleCount(
  params: TopicsByArticleCountParams = {},
  options: TopicsByArticleCountOptions = {},
) {
  return useQuery({
    ...options,
    queryKey: topicsByArticleCountKey(params),
    queryFn: () => fetchTopicsByArticleCount(params),
    staleTime: 5 * 60 * 1000,
  })
}
