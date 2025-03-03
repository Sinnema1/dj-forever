import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import dotenv from "dotenv";
import { createError } from "../middleware/errorHandler.js";
import { CONFIG } from "../constants/config.js";

dotenv.config();

/**
 * Defines the shape of a decoded JWT payload.
 */
interface DecodedToken {
  data: {
    _id: unknown;
    fullName: string;
    email: string;
  };
}

/**
 * Middleware function to authenticate JWT tokens from requests.
 * Extracts user data from the token and attaches it to the request.
 * 
 * @param {Object} req - Express request object containing headers and body.
 * @returns {Object} - The request object, potentially with an authenticated user.
 */
export const authenticateToken = ({ req }: { req: any }) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization && token.startsWith("Bearer ")) {
    token = token.split(" ")[1].trim();
  }

  if (!token) {
    console.log(`No token provided for ${req.body.operationName || "unknown operation"}.`);
    return req; // Continue without authentication
  }

  try {
    if (!CONFIG.JWT_SECRET) {
      throw createError("JWT secret is missing in environment variables.", 500);
    }

    const decoded = jwt.verify(token, CONFIG.JWT_SECRET, {
      maxAge: "2h",
    }) as DecodedToken;

    req.user = decoded.data;
    console.log("Token verified. User:", req.user);
  } catch (err: any) {
    console.error("Invalid token:", err.message);
    throw createError("Invalid or expired token. Please log in again.", 401);
  }

  return req;
};

/**
 * Generates a signed JWT token for authentication.
 * 
 * @param {string} fullName - The full name of the user.
 * @param {string} email - The email of the user.
 * @param {string} _id - The user's ID.
 * @returns {string} - A JWT token.
 */
export const signToken = (fullName: string, email: string, _id: unknown): string => {
  if (!CONFIG.JWT_SECRET) {
    throw createError("JWT secret is missing in environment variables.", 500);
  }

  const payload = { fullName, email, _id };
  return jwt.sign({ data: payload }, CONFIG.JWT_SECRET, {
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
};