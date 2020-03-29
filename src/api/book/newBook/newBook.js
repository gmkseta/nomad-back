import { prisma } from "../../../../generated/prisma-client";

export default{
  Mutation: {
    newBook: async(_, args, {request, isAuthenticted}) => {
      console.log(args)
      const {title, author, barcode,  price=0, review_average=0} = args;
      const book = await prisma.createBook({
        title,
        author, 
        barcode, 
        price,
        review_average
      });
      return book;
    }
  }
}