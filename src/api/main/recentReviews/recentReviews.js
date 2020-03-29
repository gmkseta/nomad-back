import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    recentReviews: async (_, { limitNumber }) => {
      const reviews = await prisma.reviews({ last: limitNumber });
      return reviews;
    }
  }
}