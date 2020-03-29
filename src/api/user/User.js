import { prisma } from "../../../generated/prisma-client";

export default {
  User: {
    
    reviews: ({ id }) => prisma.user({ id }).reviews(),
    isSelf: (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      return user.id === parentId;
    }
  }
};
