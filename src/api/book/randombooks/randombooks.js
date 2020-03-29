import { prisma } from "../../../../generated/prisma-client"
import { isAuthenticated } from "../../../middleware";


const LIMIT = 20;

export default {
  Query: {
    randomBooks: async (_, {categoryId, afterId}, {request}) => {
      isAuthenticated(request);
      const { user } = request;
      const category = await prisma.$exists.category({ id: categoryId || "" });
      const filterOptions = { after: afterId || null, first: LIMIT }
      
      if (category) {
        const books = await prisma.books({
          where: {
            OR: [
              {
                category: {
                  id: categoryId
                },
                reviews_none: {
                  user: {
                    id: user.id
                  }
                }

              }
            ]
          },
          after: afterId || null,
          first: LIMIT
        })
        return books;
        

      } else {
        const books = await prisma.books({
          where: {
            reviews_none: {
              user: {
                id: user.id
              }
            }
          },
          after: afterId || null,
          first: LIMIT
        });
        return books;

      }

    }

  }
}