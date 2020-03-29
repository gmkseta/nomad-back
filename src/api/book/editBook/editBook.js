import { prisma } from "../../../../generated/prisma-client";
import { isAuthenticated } from "../../../middleware";
export default {
  Mutation: {
    editBook: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { id, title, price, author, barcode } = args;
      return prisma.updateBook(
        {
          where: { id: id },
          data: { title, price, author, barcode }
        }
      )


    }
  }
}