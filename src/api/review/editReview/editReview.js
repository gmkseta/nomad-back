import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middleware";

const DELETE = "DELETE";
const EDIT = "EDIT";

export default {
  Mutation: {
    editReview: async (_, { id, content, rate, action }, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      const review = await prisma.$exists.review({id, user: {id: user.id}})
      if (review){
        if (action === EDIT){
          if (rate <= 5 && rate >= 0) {
            return prisma.updateReview({
              data: {content, rate},
              where: {id}
            })
          } else {
            throw Error("잘못된 별점입니다.")
          }
        } else if(action === DELETE) {
          return prisma.deleteReview({id});
        }
        
      } else {
        throw Error("잘못된 접근입니다.")
      }
      
    }
  }
}