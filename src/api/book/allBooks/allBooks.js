import { prisma } from "../../../../generated/prisma-client";

const LIMIT = 10;

export default {
  Query: {
    // infinity 
    allBooks: async (_, {categoryId, afterId} ) => {
      const category = await prisma.$exists.category({id: categoryId || ""});
      const filterOptions = { after: afterId || null, first: LIMIT }
      if (category){
        
        const books = await prisma.books({
          where: {
            category: {
              id: categoryId
            }
          },
          after: afterId || null,
          first: LIMIT
        })
        return books;
      } else {
        // categoryId: ""으로 주면 모든 book
        
        const books = await prisma.books(filterOptions, {});
        return books;
      }
    }
  }
};


