import { prisma } from "../../../../generated/prisma-client";
import passwordHash from "password-hash";

export default {
  Mutation: {
    createUser: async (_, { username, email, password }) => {
      try {
        const hashPassword = passwordHash.generate(password);
        await prisma.createUser({ username, email, password: hashPassword });
        return true;
      } catch (e) {
        throw Error(e.message);
      }
    }
  }
};