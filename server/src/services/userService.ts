import { User as UserModel } from "../models/index.js";
import { signToken } from "../middleware/auth.js";
import { createError } from "../middleware/errorHandler.js";

/**
 * Retrieves a user by ID, excluding sensitive fields.
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<Object>} The user object with GraphQL-compatible status.
 * @throws {Error} If the user is not found.
 */
export const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-__v -password").exec();

  if (!user) throw createError("User not found.", 404);
  
  // return something
};

/**
 * Finds a user by their email address.
 * @param {string} email - The user's email address.
 * @returns {Promise<Object|null>} The user object or null if not found.
 */
export const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email });
  // return something
};

/**
 * Creates a new user and returns an authentication token.
 * @param {string} username - Desired username.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<{ token: string; user: Object }>} JWT and user details.
 */
export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const user = await UserModel.create({ username, email, password });
    const token = signToken(user.username, user.email, user._id, user.isAdmin);
    // return something
  } catch (error: any) {
    throw createError("Error creating user: " + error.message, 500);
  }
};

/**
 * Authenticates a user and returns a JWT.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{ token: string; user: Object }>} JWT and user details.
 * @throws {Error} If authentication fails.
 */
export const loginUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw createError("User not found.", 404);

  const isValid = await user.isCorrectPassword(password);
  if (!isValid) throw createError("Incorrect password.", 401);

  const token = signToken(user.username, user.email, user._id, user.isAdmin);
  // return something
};