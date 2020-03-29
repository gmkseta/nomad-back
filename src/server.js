import "./env";
import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import schema from "./schema";
import passport from "passport";
import { authenticateJwt } from "./passport";

import { isAuthenticated } from "./middleware"
import { googleLogin, googleLoginCallback, returnToken } from "./controllers/socialLoginController";

const PORT = process.env.PORT || 3000;


const server = new GraphQLServer({ schema, 
  context: ({ request }) => {
      try {
        console.log(request.body)
        return { request, isAuthenticated }
      } catch (error){
        console.log(request.body)
        console.log(error)
        return (error)
      }
      
    }
});


server.express.use(logger("dev"));
server.express.use(authenticateJwt);

server.express.get("/auth/google", googleLogin);
server.express.get("/auth/google/callback", googleLoginCallback, returnToken);


server.start({ port: PORT }, () =>
  console.log(`Server running on  http://localhost:${PORT}`)
);