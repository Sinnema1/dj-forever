import bcrypt from "bcrypt";
import User from "../models/User.js";
import fs from "fs";
import { createError } from "../middleware/errorHandler.js";

/**
 * Seeds the database with user data from a JSON file.
 * @function seedDatabase
 * @returns {Promise<void>} Logs success or throws an error.
 */
export const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    // Read and parse user data from JSON file
    const userData = JSON.parse(fs.readFileSync("./src/seeds/userData.json", "utf-8"));

    // Manually hash passwords before inserting
    const hashedUsers = await Promise.all(
      userData.users.map(async (user: any) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    // Clear existing users
    await User.deleteMany({});
    console.log("User collection cleared");

    // Insert new user data
    await User.insertMany(hashedUsers);
    console.log("User data seeded successfully");
  } catch (error) {
    console.error("Error seeding the database:", error);
    throw createError("Failed to seed the database.", 500);
  }
};