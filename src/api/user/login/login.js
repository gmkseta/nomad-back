import { prisma } from "../../../../generated/prisma-client";
import passwordHash from "password-hash";
import { generateToken } from "../../../utils";

export default {
  Mutation: {
    login: async (_, { email, password }) => {
      try {
        const user = await prisma.user({ email });
        if(user === null){
          throw Error("로그인 정보가 일치하지 않습니다.");
        }
        const isMe = passwordHash.verify(password, user.password);
        
        if (isMe) {
          return generateToken(user.id);
        } else {
          throw Error("로그인 정보가 일치하지 않습니다.");
        }
      } catch (error) {
        throw Error(error.message);
        
      }
    }
  }
};