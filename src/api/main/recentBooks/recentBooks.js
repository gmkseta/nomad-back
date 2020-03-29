import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    recentBooks: async (_, {limitNumber}) => {
      const books = await prisma.books({ last: limitNumber});
      return books;
    }
  }
}