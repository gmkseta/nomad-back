import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middleware";

export default {
  Mutation: {
    // 인증을 통해 얻는 resolver
    toggleLike: async (_, args, { request }) => {
      isAuthenticated(request);
      
      const { bookId } = args;
      const { user } = request;
      console.log(user)
      const filterOptions = {
        AND: [
          {
            user: {
              id: user.id
            }
          },
          {
            book: {
              id: bookId
            }
          }

        ]
      }
      try {
        const existingLike = await prisma.$exists.like(filterOptions)
        if (existingLike) {
          await prisma.deleteManyLikes(filterOptions)

        } else {
          await prisma.createLike({
            user: {
              connect: {
                id: user.id
              }
            },
            book: {
              connect: {
                id: bookId
              }
            }
          })
        }
        return true;
      } catch {
        return false;
      }
    }
  }
}