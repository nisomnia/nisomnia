import { db } from "@/server/db"

export const getUserByUsername = async (username: string) => {
  return await db.query.usersTable.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  })
}

export const searchUsers = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.usersTable.findMany({
    where: (users, { and, or, ilike }) =>
      and(
        or(
          ilike(users.name, `%${searchQuery}%`),
          ilike(users.username, `%${searchQuery}%`),
        ),
      ),
    limit: limit,
  })
}
