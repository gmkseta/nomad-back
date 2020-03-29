import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    seeFullBook: async(_, {id}, {request}) => {
      const {user} = request;

      const book = await prisma.book({id});
      
      return book;
      
      
    }
  }
};