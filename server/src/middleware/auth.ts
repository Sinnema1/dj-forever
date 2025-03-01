import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql/error";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware function to authenticate JWT tokens from requests.
 * @param {Object} req - Express request object containing headers and body.
 * @returns {Object} - The request object, potentially with an authenticated user.
 */
export const authenticateToken = ({ req }: { req: any }) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (token?.startsWith("Bearer ")) {
    token = token.split(" ")[1].trim();
  }

  if (!token) {
    console.log(`No token provided for ${req.body.operationName}.`);
    return req; // Continue without authentication
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new GraphQLError("JWT secret is missing in environment variables.", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET, {
      maxAge: "2h",
    });

    req.user = decoded.data;
    console.log("✅ Token verified. User:", req.user);
  } catch (err: any) {
    console.error("❌ Invalid token:", err);
    throw new GraphQLError("Invalid or expired token. Please log in again.", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  return req;
};

/**
 * Generates a signed JWT token for authentication.
 * @param {string} fullName - The full name of the user.
 * @param {string} email - The email of the user.
 * @param {unknown} _id - The user's ID.
 * @returns {string} - A JWT token.
 */
export const signToken = (fullName: string, email: string, _id: unknown): string => {
  if (!process.env.JWT_SECRET) {
    throw new GraphQLError("JWT secret is missing in environment variables.", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }

  const payload = { fullName, email, _id };

  return jwt.sign({ data: payload }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};

/**
 * Custom AuthenticationError class for GraphQL.
 */
export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: { code: "UNAUTHENTICATED" },
    });
    Object.defineProperty(this, "name", { value: "AuthenticationError" });
  }
}