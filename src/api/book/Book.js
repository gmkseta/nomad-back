import { prisma } from "../../../generated/prisma-client";

export default {
  Book: {
    category: ({id}) => prisma.book({id}).category(),
    keywords: ({ id }) => prisma.book({ id }).keywords(),
    reviews: ({id}) => prisma.book({id}).reviews(),
    reviewsCount: parent =>
      prisma
        .reviewsConnection({
          where: { book: { id: parent.id } }
        })
        .aggregate()
        .count()
  }
};
