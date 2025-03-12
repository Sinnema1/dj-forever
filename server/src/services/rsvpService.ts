import { Types } from "mongoose";
import RSVP, { RSVPDocument } from "../models/RSVP.js";
import { createError } from "../middleware/errorHandler.js";

/**
 * Submits an RSVP for an authenticated user.
 *
 * @param {string} userId - The user's ID.
 * @param {boolean} attending - Whether the user is attending.
 * @param {string} mealPreference - The user's meal choice.
 * @param {string} [allergies] - Optional allergies.
 * @param {string} [additionalNotes] - Optional additional notes.
 * @returns {Promise<RSVPDocument>} - The newly created RSVP.
 */
export const submitRSVP = async (
  userId: string,
  attending: boolean,
  mealPreference: string,
  allergies?: string,
  additionalNotes?: string
): Promise<RSVPDocument> => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw createError("Invalid user ID.", 400);
    }

    const existingRSVP = await RSVP.findOne({ userId });
    if (existingRSVP) {
      throw createError("RSVP already submitted.", 400);
    }

    const newRSVP = await RSVP.create({
      userId: new Types.ObjectId(userId),
      attending,
      mealPreference,
      allergies: allergies || "",
      additionalNotes: additionalNotes || "",
    });

    return newRSVP;
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError(`Error submitting RSVP: ${error.message}`, 500);
  }
};

/**
 * Retrieves an RSVP for an authenticated user.
 *
 * @param {string} userId - The user's ID.
 * @returns {Promise<RSVPDocument | null>} - The found RSVP or null if not found.
 */
export const getRSVP = async (userId: string): Promise<RSVPDocument | null> => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw createError("Invalid user ID.", 400);
    }

    const rsvp = await RSVP.findOne({ userId });

    return rsvp || null;
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError(`Error retrieving RSVP: ${error.message}`, 500);
  }
};

/**
 * Updates an existing RSVP.
 *
 * @param {string} userId - The user's ID.
 * @param {Partial<RSVPDocument>} updates - Fields to update in the RSVP.
 * @returns {Promise<RSVPDocument>} - The updated RSVP.
 */
export const editRSVP = async (
  userId: string,
  updates: Partial<RSVPDocument>
): Promise<RSVPDocument> => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw createError("Invalid user ID.", 400);
    }

    const rsvp = await RSVP.findOneAndUpdate({ userId }, updates, {
      new: true,
      runValidators: true,
    });

    if (!rsvp) {
      throw createError("RSVP not found.", 404);
    }

    return rsvp;
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError(`Error updating RSVP: ${error.message}`, 500);
  }
};
