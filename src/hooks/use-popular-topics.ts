"use client"

import { useQuery } from "@tanstack/react-query"

import { fetchClient } from "@/api/client"

const POPULAR_TOPICS_LANGUAGE = "id"
const POPULAR_TOPICS_LIMIT = 8

export function usePopularTopics() {
  return useQuery({
    queryKey: [
      "topics",
      "popular",
      POPULAR_TOPICS_LANGUAGE,
      POPULAR_TOPICS_LIMIT,
    ],
    queryFn: async () => {
      const { data, error } = await fetchClient.POST(
        "/topic/by-article-count",
        {
          body: {
            language: POPULAR_TOPICS_LANGUAGE,
            perPage: POPULAR_TOPICS_LIMIT,
          },
        },
      )
      if (error) throw error
      return data ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}
