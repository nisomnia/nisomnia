import { and, count, eq } from "drizzle-orm"

import { db } from "@/server/db"
import {
  genresTable,
  movieGenresTable,
  movieOverviewsTable,
  movieProductionCompaniesTable,
  moviesTable,
  overviewsTable,
  productionCompaniesTable,
} from "@/server/db/schema"
import { getCache, setCache } from "@/utils/redis"

export const getMovieBySlug = async (slug: string) => {
  const cacheKey = `movie:slug:${slug}`

  const cached = await getCache(cacheKey)
  if (cached) {
    return cached
  }

  const movieData = await db.query.moviesTable.findFirst({
    where: (movie, { eq }) => eq(movie.slug, slug),
  })

  if (movieData) {
    const movieGenresData = await db
      .select({
        id: genresTable.id,
        title: genresTable.title,
        slug: genresTable.slug,
      })
      .from(movieGenresTable)
      .leftJoin(moviesTable, eq(movieGenresTable.movieId, moviesTable.id))
      .leftJoin(genresTable, eq(movieGenresTable.genreId, genresTable.id))
      .where(eq(moviesTable.id, movieData.id))

    const movieOverviewsData = await db
      .select({
        id: overviewsTable.id,
        content: overviewsTable.content,
        language: overviewsTable.language,
      })
      .from(movieOverviewsTable)
      .leftJoin(moviesTable, eq(movieOverviewsTable.movieId, moviesTable.id))
      .leftJoin(
        overviewsTable,
        eq(movieOverviewsTable.overviewId, overviewsTable.id),
      )
      .where(eq(moviesTable.id, movieData.id))

    const movieProductionCompaniesData = await db
      .select({
        id: productionCompaniesTable.id,
        name: productionCompaniesTable.name,
        logo: productionCompaniesTable.logo,
        slug: productionCompaniesTable.slug,
      })
      .from(movieProductionCompaniesTable)
      .leftJoin(
        moviesTable,
        eq(movieProductionCompaniesTable.movieId, moviesTable.id),
      )
      .leftJoin(
        productionCompaniesTable,
        eq(
          movieProductionCompaniesTable.productionCompanyId,
          productionCompaniesTable.id,
        ),
      )
      .where(eq(moviesTable.id, movieData.id))

    const data = {
      ...movieData,
      overview: movieOverviewsData[0]?.content,
      genres: movieGenresData,
      productionCompanies: movieProductionCompaniesData,
    }

    // Cache the result for 1 hour
    await setCache(cacheKey, data, 3600)

    return data
  }
}

export const getLatestMovies = async ({
  page,
  perPage,
}: {
  page: number
  perPage: number
}) => {
  const movies = await db.query.moviesTable.findMany({
    where: (movies, { eq }) => eq(movies.status, "published"),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
  })

  return movies
}

export const getRelatedMovies = async ({
  currentMovieId,
  genreId,
  limit,
}: {
  currentMovieId: string
  genreId: string
  limit: number
}) => {
  const movies = await db.query.moviesTable.findMany({
    where: (movies, { eq, and, not, inArray }) =>
      and(
        eq(movies.status, "published"),
        not(eq(movies.id, currentMovieId)),
        inArray(
          movies.id,
          db
            .select({ id: movieGenresTable.movieId })
            .from(movieGenresTable)
            .where(eq(movieGenresTable.genreId, genreId)),
        ),
      ),
    limit: limit,
    orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
    with: {
      genres: true,
    },
  })

  const result = movies.filter((movie) =>
    movie.genres.some((genre) => genre.genreId === genreId),
  )

  return result
}

export const getMoviesByGenreId = async ({
  genreId,
  page,
  perPage,
}: {
  genreId: string
  page: number
  perPage: number
}) => {
  const movies = await db.query.moviesTable.findMany({
    where: (movies, { eq, and, inArray }) =>
      and(
        eq(movies.status, "published"),
        inArray(
          movies.id,
          db
            .select({ id: movieGenresTable.movieId })
            .from(movieGenresTable)
            .where(eq(movieGenresTable.genreId, genreId)),
        ),
      ),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
    with: {
      genres: true,
    },
  })

  const result = movies.filter((movie) =>
    movie.genres.some((genre) => genre.genreId === genreId),
  )

  return result
}

export const getMoviesByProductionCompanyId = async ({
  productionCompanyId,
  page,
  perPage,
}: {
  productionCompanyId: string
  page: number
  perPage: number
}) => {
  const movies = await db.query.moviesTable.findMany({
    where: (movies, { eq, and, inArray }) =>
      and(
        eq(movies.status, "published"),
        inArray(
          movies.id,
          db
            .select({ id: movieProductionCompaniesTable.movieId })
            .from(movieProductionCompaniesTable)
            .where(
              eq(
                movieProductionCompaniesTable.productionCompanyId,
                productionCompanyId,
              ),
            ),
        ),
      ),
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
    with: {
      productionCompanies: true,
    },
  })

  const result = movies.filter((movie) =>
    movie.productionCompanies.some(
      (productionCompany) =>
        productionCompany.productionCompanyId === productionCompanyId,
    ),
  )

  return result
}

export const getMoviesSitemap = async ({
  page,
  perPage,
}: {
  page: number
  perPage: number
}) => {
  const movies = await db.query.moviesTable.findMany({
    where: (movies, { eq }) => eq(movies.status, "published"),
    columns: {
      slug: true,
      updatedAt: true,
    },
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
  })

  return movies
}

export const getMoviesCount = async () => {
  const data = await db
    .select({ count: count() })
    .from(moviesTable)
    .where(and(eq(moviesTable.status, "published")))

  const result = data[0].count

  return result
}

export const getMoviesCountByGenreId = async (genreId: string) => {
  const data = await db
    .select({ count: count() })
    .from(moviesTable)
    .innerJoin(movieGenresTable, eq(moviesTable.id, movieGenresTable.movieId))
    .where(
      and(
        eq(moviesTable.status, "published"),
        eq(movieGenresTable.genreId, genreId),
      ),
    )

  const result = data[0].count

  return result
}

export const getMoviesCountByProductionCompanyId = async (
  productionCompanyId: string,
) => {
  const data = await db
    .select({ count: count() })
    .from(moviesTable)
    .innerJoin(
      movieProductionCompaniesTable,
      eq(moviesTable.id, movieProductionCompaniesTable.movieId),
    )
    .where(
      and(
        eq(moviesTable.status, "published"),
        eq(
          movieProductionCompaniesTable.productionCompanyId,
          productionCompanyId,
        ),
      ),
    )

  const result = data[0].count

  return result
}

export const searchMovies = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  const movies = await db.query.moviesTable.findMany({
    where: (movies, { eq, and, or, ilike }) =>
      and(
        eq(movies.status, "published"),
        or(
          ilike(movies.title, `%${searchQuery}%`),
          ilike(movies.slug, `%${searchQuery}%`),
        ),
      ),
    orderBy: (movies, { desc }) => [desc(movies.updatedAt)],
    limit: limit,
  })

  return movies
}
