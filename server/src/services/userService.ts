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
    if (!Types.ObjectId.isValid(userId))
      throw createError("Invalid user ID.", 400);

    const user = await User.findById(userId)
      .populate("rsvpId")
      .select("-password");
    if (!user) throw createError("User not found.", 404);

    return user;
  } catch (error: any) {
    throw createError(`Error retrieving user: ${error.message}`, 500);
  }
};

/**
 * Retrieves all users in the system. (Admin access only)
 *
 * @returns {Promise<User[]>} - Array of user objects without password fields.
 */
export const getAllUsers = async () => {
  try {
    // Exclude password field from results
    return await User.find({}).select("-password");
  } catch (error: any) {
    throw createError(`Error retrieving users: ${error.message}`, 500);
  }
};

/**
 * Registers a new user.
 *
 * @param {string} fullName - The user's full name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{ token: string; user: User }>} - The JWT token and user data.
 * @throws {Error} - If user already exists or creation fails.
 */
export const createUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw createError("User already exists.", 400);

    // Create user in database
    const user = await User.create({ fullName, email, password });

    // Generate authentication token
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
    // Ensure password is retrieved from the database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw createError("Invalid email or password.", 401);
    }

    // Defensive check before password comparison
    if (!user.password) {
      throw createError(
        "User password is missing. Please reset your password.",
        500
      );
    }

    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError("Invalid email or password.", 401);
    }

    // Generate JWT token
    const token = signToken(user.fullName, user.email, user._id.toString());

    return { token, user };
  } catch (error: any) {
    throw createError(`Authentication failed: ${error.message}`, 401);
  }
};

/**
 * Updates a user’s fullName and/or email.
 */
export const updateUser = async (
  id: string,
  input: { fullName?: string; email?: string }
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw createError("Invalid user ID.", 400);
  }

  const updated = await User.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .lean();

  if (!updated) {
    throw createError("User not found.", 404);
  }
  return updated;
};
