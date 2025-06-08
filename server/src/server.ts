import cors from "cors";
import express, { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import path from "node:path";
import { fileURLToPath } from "node:url";

import db from "./config/connection.js";
import { typeDefs, resolvers } from "./graphql/index.js";
import { createContext } from "./graphql/context.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { CONFIG } from "./constants/config.js";

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startApolloServer = async () => {
  try {
    // 0) Validate critical env vars
    if (!CONFIG.FRONTEND_URL) {
      throw new Error(
        "CONFIG.FRONTEND_URL is not defined. Check your environment variables."
      );
    }
    // 1) connect to database
    await db();

    // 2) start Apollo
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    // 3) create Express app
    const app = express();
    const PORT = process.env.PORT ?? 3001;

    // 4) middleware
    app.use(cors({ origin: CONFIG.FRONTEND_URL }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // 5) GraphQL endpoint
    app.use(
      "/graphql",
      expressMiddleware(server, {
        // pass in our context factory
        context: createContext,
      })
    );

    // 6) serve client in prod
    // REMOVED: static file serving for client build, since frontend is deployed separately

    // 7) health check
    app.get("/health", (_req, res) => res.sendStatus(200));

    // 8) global error handler
    app.use(errorHandler);

    // 9) start listening
    const httpServer = app.listen(PORT, () => {
      console.log(`✅ Server ready at http://localhost:${PORT}/graphql`);
    });

    // 10) graceful shutdown
    const shutdown = async () => {
      console.log("🛑 Shutting down...");
      await server.stop();
      httpServer.close(() => process.exit(0));
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err: unknown) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  process.exit(1);
});

startApolloServer();
