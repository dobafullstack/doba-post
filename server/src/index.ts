require("dotenv").config();
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import MongoStore from "connect-mongo";
import cors from "cors";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import Logger from "./Configs/Logger";
import { COOKIE_NAME, __prod__ } from "./Constants";
import { PostResolver, UserResolver } from "./Resolvers";
import { Context } from "./Types/Context";

const main = async () => {
  const app = express();
  const PORT = process.env.PORT || 4000;

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver],
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({ req, res }): Context => ({ req, res }),
  });

  //session
  const mongodb_url = process.env.MONGODB_URL as string;
  await mongoose.connect(mongodb_url);

  Logger.success("MongoDB is connected");

  app.use(
    session({
      name: COOKIE_NAME,
      store: MongoStore.create({ mongoUrl: mongodb_url }),
      cookie: {
        maxAge: 1000 * 60 * 60, //one hour
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
      secret: process.env.SECRET_SESSION as string,
      saveUninitialized: false,
      resave: false,
    })
  );

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(PORT, () => {
    Logger.success(
      `Server is running on PORT: ${PORT}, GraphQL server is running on http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
};

main().catch((err) => Logger.error(err));
