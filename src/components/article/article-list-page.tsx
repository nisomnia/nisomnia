import { getRouteApi, Link } from "@tanstack/react-router"

import {
  ArticleCard,
  ArticleRowSkeleton,
} from "@/components/article/article-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  useArticleSearch,
  useArticlesByLanguageInfinite,
} from "@/hooks/api/article"

const Route = getRouteApi("/article/")
const PAGE_SIZE = 20

export function ArticleListPage() {
  const { q } = Route.useSearch()
  const searchQuery = q?.trim()
  const isSearching = Boolean(searchQuery)

  const {
    data: searchData,
    isLoading: searchIsLoading,
    isError: searchIsError,
    refetch: refetchSearch,
  } = useArticleSearch(searchQuery, PAGE_SIZE)
  const {
    data: infiniteData,
    isLoading: infiniteIsLoading,
    isError: infiniteIsError,
    isFetchNextPageError,
    refetch: refetchArticles,
    hasNextPage: infiniteHasNextPage,
    isFetchingNextPage: infiniteIsFetchingNextPage,
    fetchNextPage: infiniteFetchNextPage,
  } = useArticlesByLanguageInfinite(PAGE_SIZE)

  const searchResults = searchData ?? []
  const listArticles =
    infiniteData?.pages.flatMap((page) => page?.articles ?? []) ?? []
  const articles = isSearching ? searchResults : listArticles

  const isLoading = isSearching ? searchIsLoading : infiniteIsLoading
  const isError = isSearching ? searchIsError : infiniteIsError

  const hasNextPage = !isSearching && infiniteHasNextPage
  const isFetchingNextPage = !isSearching && infiniteIsFetchingNextPage

  function handleLoadMore() {
    if (!infiniteIsFetchingNextPage) {
      infiniteFetchNextPage()
    }
  }

  return (
    <div className="page-shell">
      {isSearching ? (
        <div className="page-heading">
          <h1>Hasil pencarian.</h1>
          <p className="text-muted-foreground">
            {isLoading
              ? "Mencari artikel..."
              : isError
                ? `Pencarian untuk "${searchQuery}" belum selesai.`
                : `Menampilkan ${articles.length} artikel untuk "${searchQuery}".`}
          </p>
        </div>
      ) : (
        <div className="page-heading">
          <p className="eyebrow">Jelajahi</p>
          <h1>Semua artikel.</h1>
          <p>Bacaan terbaru dari seluruh topik di Nisomnia.</p>
        </div>
      )}

      {isLoading && (
        <div role="status" className="article-list">
          <span className="sr-only">Memuat artikel...</span>
          <ArticleRowSkeleton />
          <ArticleRowSkeleton />
          <ArticleRowSkeleton />
        </div>
      )}

      {isError && (
        <div className="inline-status">
          <p role="alert">
            {articles.length
              ? "Artikel berikutnya belum dapat dimuat."
              : "Artikel belum dapat dimuat."}
          </p>
          <Button
            variant="outline"
            onClick={() =>
              isSearching
                ? refetchSearch()
                : isFetchNextPageError
                  ? infiniteFetchNextPage()
                  : refetchArticles()
            }
          >
            Coba lagi
          </Button>
        </div>
      )}

      {!isLoading && !isError && articles.length === 0 && (
        <div className="inline-status">
          <h2 className="text-xl font-semibold">Belum ada artikel.</h2>
          <p>
            {isSearching
              ? "Coba kata kunci lain atau jelajahi semua artikel."
              : "Bacaan baru akan muncul di sini."}
          </p>
          <Button
            variant="outline"
            render={
              <Link
                to={isSearching ? "/article" : "/topic"}
                search={{ q: undefined }}
              />
            }
          >
            {isSearching ? "Semua artikel" : "Jelajahi topik"}
          </Button>
        </div>
      )}

      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            excerpt={article.excerpt}
            featuredImage={article.featuredImage}
            slug={article.slug}
            title={article.title}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        {hasNextPage && !isError && (
          <Button disabled={isFetchingNextPage} onClick={handleLoadMore}>
            {isFetchingNextPage && <Spinner />}
            {isFetchingNextPage ? "Memuat artikel..." : "Muat lebih banyak"}
          </Button>
        )}
      </div>
    </div>
  )
}
