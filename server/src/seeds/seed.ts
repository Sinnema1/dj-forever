import bcrypt from "bcrypt";
import mongoose from "mongoose";
import fs from "fs/promises";
import User from "../models/User.js";
import RSVP from "../models/RSVP.js";
import { createError } from "../middleware/errorHandler.js";

export const seedDatabase = async () => {
  try {
    console.log("🚀  Seeding database…");

    // Load JSON fixtures
    const userJson = JSON.parse(
      await fs.readFile("./src/seeds/userData.json", "utf8")
    );
    const rsvpJson = JSON.parse(
      await fs.readFile("./src/seeds/rsvpData.json", "utf8")
    );

    /* -------- USERS -------- */
    const usersToInsert = await Promise.all(
      userJson.users.map(async (u: any) => ({
        fullName: u.fullName,
        email: u.email,
        password: await bcrypt.hash(u.password, 10),
        isInvited: u.isInvited === true,
        hasRSVPed: !!u.hasRSVPed,
        isAdmin: u.isAdmin === true,
      }))
    );

    console.log(`• Prepared ${usersToInsert.length} users`);

    const insertedUsers = await User.insertMany(usersToInsert);
    console.log(`✅ Inserted ${insertedUsers.length} users`);

    // Build email → ObjectId map
    const userMap = new Map(insertedUsers.map((u) => [u.email, u._id]));

    /* -------- RSVPs -------- */
    interface RSVPJson {
      userEmail: string;
      attending: string | boolean;
      mealPreference?: string;
      allergies?: string;
      additionalNotes?: string;
    }

    interface RSVPInsert {
      userId: mongoose.Types.ObjectId;
      attending: boolean;
      mealPreference: string;
      allergies: string;
      additionalNotes: string;
    }

    interface RsvpJsonData {
      rsvps: RSVPJson[];
    }

    const rsvpsToInsert: RSVPInsert[] = (rsvpJson as RsvpJsonData).rsvps
      .map((r: RSVPJson): RSVPInsert | null => {
        const userId: mongoose.Types.ObjectId | undefined = userMap.get(
          r.userEmail
        );
        if (!userId) {
          console.warn(`⚠️  No matching user for RSVP: ${r.userEmail}`);
          return null;
        }
        // Normalize attending to boolean
        let attendingBool: boolean;
        if (typeof r.attending === "string") {
          attendingBool = r.attending.toUpperCase() === "YES";
        } else {
          attendingBool = Boolean(r.attending);
        }
        return {
          userId,
          attending: attendingBool,
          mealPreference: r.mealPreference || "",
          allergies: r.allergies || "",
          additionalNotes: r.additionalNotes || "",
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));

    if (rsvpsToInsert.length) {
      const insertedRSVPs = await RSVP.insertMany(rsvpsToInsert);
      console.log(`✅ Inserted ${insertedRSVPs.length} RSVPs`);

      // Back‑reference users
      await Promise.all(
        insertedRSVPs.map((r) =>
          User.findByIdAndUpdate(r.userId, {
            rsvpId: r._id,
            hasRSVPed: true,
          })
        )
      );
      console.log("🎉  Seeding complete");
    } else {
      console.warn("⚠️  No RSVPs inserted");
    }
  } catch (err: any) {
    console.error("❌  Seed error:", err);
    throw createError("Failed to seed the database.", 500);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};
