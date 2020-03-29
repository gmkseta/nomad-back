import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    searchBook: async (_, {term}) => prisma.books({
      where: {
        OR: [
          { title_contains: term },
          { author_contains: term },
          {
            keywords_some: {
              name_contains: term
            }
          },
          {
            category: {
              name_contains: term
            }
          }
        ]
      }
    })
  }
}
