"use client"

import { useQuery } from "@tanstack/react-query"

import { fetchClient } from "@/lib/api/client"

const TOPICS_LANGUAGE = "id"
const TOPICS_PER_PAGE = 100

export function useTopics() {
  return useQuery({
    queryKey: ["topics", "all", TOPICS_LANGUAGE],
    queryFn: async () => {
      const { data, error } = await fetchClient.POST("/topic/by-language", {
        body: {
          language: TOPICS_LANGUAGE,
          page: 1,
          perPage: TOPICS_PER_PAGE,
        },
      })
      if (error) throw error
      return data ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}
