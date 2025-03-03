import { Types } from "mongoose";
import { RSVP } from "../models/index.js";
import { createError } from "../middleware/errorHandler.js";

/**
 * Submits an RSVP for an authenticated user.
 *
 * @param {string} userId - The user's ID.
 * @param {boolean} attending - Whether the user is attending.
 * @param {string} mealPreference - The user's meal choice.
 * @param {string} [allergies] - Optional allergies.
 * @param {string} [additionalNotes] - Optional additional notes.
 * @returns {Promise<RSVP>} - The newly created RSVP.
 * @throws {Error} - If RSVP already exists or user is invalid.
 */
export const submitRSVP = async (
  userId: string,
  attending: boolean,
  mealPreference: string,
  allergies?: string,
  additionalNotes?: string
) => {
  try {
    if (!Types.ObjectId.isValid(userId)) throw createError("Invalid user ID.", 400);

    const existingRSVP = await RSVP.findOne({ userId });
    if (existingRSVP) throw createError("RSVP already submitted.", 400);

    const newRSVP = await RSVP.create({
      userId: new Types.ObjectId(userId),
      attending,
      mealPreference,
      allergies: allergies || "",
      additionalNotes: additionalNotes || "",
    });

    return newRSVP;
  } catch (error: any) {
    throw createError(`Error submitting RSVP: ${error.message}`, 500);
  }
};

/**
 * Retrieves an RSVP for an authenticated user.
 *
 * @param {string} userId - The user's ID.
 * @returns {Promise<RSVP>} - The found RSVP.
 * @throws {Error} - If RSVP is not found or user ID is invalid.
 */
export const getRSVP = async (userId: string) => {
  try {
    if (!Types.ObjectId.isValid(userId)) throw createError("Invalid user ID.", 400);

    const rsvp = await RSVP.findOne({ userId });
    if (!rsvp) throw createError("RSVP not found.", 404);

    return rsvp;
  } catch (error: any) {
    throw createError(`Error retrieving RSVP: ${error.message}`, 500);
  }
};

/**
 * Updates an existing RSVP.
 *
 * @param {string} userId - The user's ID.
 * @param {Partial<RSVP>} updates - Fields to update in the RSVP.
 * @returns {Promise<RSVP>} - The updated RSVP.
 * @throws {Error} - If RSVP is not found, user ID is invalid, or update fails.
 */
export const editRSVP = async (userId: string, updates: any) => {
  try {
    if (!Types.ObjectId.isValid(userId)) throw createError("Invalid user ID.", 400);

    const rsvp = await RSVP.findOneAndUpdate({ userId }, updates, { new: true, runValidators: true });
    if (!rsvp) throw createError("RSVP not found.", 404);

    return rsvp;
  } catch (error: any) {
    throw createError(`Error updating RSVP: ${error.message}`, 500);
  }
};