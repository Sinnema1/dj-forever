import { Types } from "mongoose";
import { User } from "../models/index.js";
import { signToken } from "../middleware/auth.js";
import { createError } from "../middleware/errorHandler.js";
import bcrypt from "bcrypt";

/**
 * Retrieves the currently authenticated user.
 *
 * @param {string} userId - The user's ID.
 * @returns {Promise<User>} - The user object without the password field.
 * @throws {Error} - If the user is not found or the ID is invalid.
 */
export const getUserById = async (userId: string) => {
  try {
    if (!Types.ObjectId.isValid(userId)) throw createError("Invalid user ID.", 400);

    const user = await User.findById(userId).populate("rsvpId").select("-password");
    if (!user) throw createError("User not found.", 404);

    return user;
  } catch (error: any) {
    throw createError(`Error retrieving user: ${error.message}`, 500);
  }
};

/**
 * Registers a new user (pre-created accounts, not public signup).
 *
 * @param {string} fullName - The user's full name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{ token: string; user: User }>} - The JWT token and user data.
 * @throws {Error} - If user already exists or creation fails.
 */
export const createUser = async (fullName: string, email: string, password: string) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw createError("User already exists.", 400);

    const user = await User.create({ fullName, email, password });

    const token = signToken(user.fullName, user.email, user._id.toString());

    return { token, user };
  } catch (error: any) {
    throw createError(`Error creating user: ${error.message}`, 500);
  }
};

/**
 * Authenticates a user and returns a JWT token.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{ token: string; user: User }>} - The JWT token and user data.
 * @throws {Error} - If authentication fails.
 */
export const authenticateUser = async (email: string, password: string) => {
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createError("Invalid email or password.", 401);
    }

    const token = signToken(user.fullName, user.email, user._id.toString());

    return { token, user };
  } catch (error: any) {
    throw createError(`Authentication failed: ${error.message}`, 401);
  }
};