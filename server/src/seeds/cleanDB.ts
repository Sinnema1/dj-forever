import User from "../models/User.js";
import { createError } from "../middleware/errorHandler.js";

/**
 * Cleans the database by removing all users.
 * @function cleanDatabase
 * @returns {Promise<void>} Logs success or throws an error.
 */
export const cleanDatabase = async () => {
  try {
    await User.deleteMany({});
    console.log("Database cleaned successfully");
  } catch (error) {
    console.error("Error cleaning the database:", error);
    throw createError("Failed to clean the database.", 500);
  }
};