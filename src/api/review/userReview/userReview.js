import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middleware";

export default {
  Query: {
    userReview: async(_, {id}, {request}) => {
      isAuthenticated(request);
      
      const user = await prisma.user({id});
      console.log(user)
      try {
        const reviews = await prisma.reviews({ where: { rate: 10, user: { id: user.id} } });
        
        return reviews;
        
      } catch (error) {
        Throw.error(error.message);
      }
      

    }
  }
}