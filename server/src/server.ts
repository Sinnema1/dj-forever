import cors from "cors";
import express, { Request, Response } from "express";
import db from "./config/connection.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./graphql/index.js";
import { authenticateToken } from "./middleware/auth.js";
import { errorHandler, createError } from "./middleware/errorHandler.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve __dirname in ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Defines the GraphQL Apollo Context interface.
 */
export interface ApolloContext {
  user: { _id: string; username: string } | null;
}

// Initialize Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

/**
 * Starts the Apollo GraphQL server and Express application.
 * Ensures database connectivity, authentication setup, and error handling.
 */
const startApolloServer = async () => {
  try {
    // Validate critical environment variables
    if (!process.env.JWT_SECRET || !process.env.someAPIKey) {
      throw createError("Essential environment variables are missing.", 500);
    }

    await server.start();
    await db();

    const app = express();
    const PORT = process.env.PORT || 3001;

    /** 
     * Enables CORS for frontend communication.
     */
    app.use(
      cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" })
    );
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    /**
     * Configures GraphQL authentication middleware.
     * Extracts user data from JWT and appends it to the request context.
     */
    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req }: { req: Request }): Promise<ApolloContext> => {
          try {
            const operationName = req.body?.operationName;

            // Skip authentication for login & user registration mutations
            if (["login", "addUser"].includes(operationName)) {
              return { user: null };
            }

            // Authenticate all other requests
            const context = authenticateToken({ req });
            return { user: context.user || null };
          } catch (error) {
            console.error("Authentication error:", error);
            return { user: null };
          }
        },
      })
    );

    /**
     * Serves the frontend React app in production.
     */
    if (process.env.NODE_ENV === "production") {
      const clientPath = path.join(__dirname, "../../client/dist");
      console.log(`Serving frontend from: ${clientPath}`);
      app.use(express.static(clientPath));
      app.get("*", (_req: Request, res: Response) =>
        res.sendFile(path.join(clientPath, "index.html"))
      );
    }

    /**
     * Health check endpoint to verify server uptime.
     */
    app.get("/health", (_req: Request, res: Response) =>
      res.status(200).send("Server is healthy!")
    );

    /**
     * Global error handling middleware.
     */
    app.use(errorHandler);

    /**
     * Starts the Express server and listens for incoming requests.
     */
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });

    /**
     * Graceful shutdown handling (e.g., for containerized environments).
     */
    process.on("SIGINT", async () => {
      console.log("Shutting down gracefully...");
      await server.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

// Start the Apollo + Express Server
startApolloServer();