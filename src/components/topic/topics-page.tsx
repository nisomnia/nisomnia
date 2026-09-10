import { TopicsList } from "@/components/topic/topics-list"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useTopicsByArticleCount } from "@/hooks/api/topic"

const PER_PAGE = 100

export function TopicsPage() {
  const {
    data: topics,
    isLoading,
    isError,
    refetch,
  } = useTopicsByArticleCount({ page: 1, perPage: PER_PAGE })

  return (
    <div className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">Jelajahi</p>
        <h1>Ikuti rasa ingin tahu.</h1>
        <p>
          {topics?.length
            ? `Temukan bacaan dari ${topics.length} topik.`
            : "Jelajahi anime, game, manga, film, dan teknologi."}
        </p>
      </div>
      {isLoading && (
        <div role="status" className="grid gap-x-10 sm:grid-cols-2">
          <span className="sr-only">Memuat topik...</span>
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="topic-link border-b">
              <Skeleton className="size-11 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
      )}
      {isError && (
        <div className="flex flex-col items-start gap-4">
          <p role="alert" className="text-muted-foreground">
            Topik belum dapat dimuat.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Coba lagi
          </Button>
        </div>
      )}
      {!isLoading &&
        !isError &&
        (topics?.length ? (
          <TopicsList topics={topics} />
        ) : (
          <p className="text-muted-foreground">Belum ada topik.</p>
        ))}
    </div>
  )
}
