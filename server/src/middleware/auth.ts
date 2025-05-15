// server/src/middleware/auth.ts
import { GraphQLError } from "graphql/error";
import jwt from "jsonwebtoken";
import { CONFIG } from "../constants/config.js";

interface DecodedToken {
  data: {
    _id: string;
    fullName: string;
    email: string;
  };
}

/**
 * Custom AuthenticationError for GraphQL
 */
export class AuthenticationError extends GraphQLError {
  constructor(message = "Authentication required.") {
    super(message, { extensions: { code: "UNAUTHENTICATED" } });
    Object.defineProperty(this, "name", { value: "AuthenticationError" });
  }
}

/**
 * Verify a Bearer token on each request and return `{ user }` for the context.
 */
export function authenticateToken({ req }: { req: any }): { user: DecodedToken["data"] | null } {
  // Skip introspection so Playground / Voyager still works
  if (req.body?.operationName === "IntrospectionQuery") {
    return { user: null };
  }

  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

  if (!token) {
    throw new AuthenticationError("No authentication token provided.");
  }

  if (!CONFIG.JWT_SECRET) {
    throw new GraphQLError("JWT secret not configured.", { extensions: { code: "INTERNAL_SERVER_ERROR" } });
  }

  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET, { maxAge: "2h" }) as DecodedToken;
    return { user: decoded.data };
  } catch (err: any) {
    throw new AuthenticationError("Invalid or expired token. Please log in again.");
  }
}

/**
 * Sign a new JWT for a user.
 */
export function signToken(fullName: string, email: string, _id: string): string {
  if (!CONFIG.JWT_SECRET) {
    throw new GraphQLError("JWT secret not configured.", { extensions: { code: "INTERNAL_SERVER_ERROR" } });
  }
  return jwt.sign({ data: { _id, fullName, email } }, CONFIG.JWT_SECRET, {
    expiresIn: "2h",
  });
}