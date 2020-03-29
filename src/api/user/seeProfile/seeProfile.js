import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    seeProfile: async (_, {id}, { request }) => {
      const user = await prisma.user({ id });
      return user
    }
  }
}

