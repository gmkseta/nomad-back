import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    recommendBooks: async (_, __) => {
      const books = await prisma.books(
        {
          orderBy: "review_average_DESC",
          limit: 10
        }
      );
      return books;
    }
  }
}