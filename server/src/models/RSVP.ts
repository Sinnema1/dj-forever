import { Schema, model, type Document } from "mongoose";

/**
 * @interface RSVPDocument
 * Defines the structure of an RSVP document in the database.
 */
export interface RSVPDocument extends Document {
  userId: Schema.Types.ObjectId;
  attending: boolean;
  mealPreference: string;
  allergies?: string | undefined;
  additionalNotes?: string | undefined;
}

/**
 * @constant rsvpSchema
 * Defines the structure of the RSVP collection in the database.
 */
const rsvpSchema = new Schema<RSVPDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensures each user can submit only one RSVP
    },
    attending: {
      type: Boolean,
      required: true,
    },
    mealPreference: {
      type: String,
      required: true,
    },
    allergies: {
      type: String,
      default: "",
    },
    additionalNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const RSVP = model<RSVPDocument>("RSVP", rsvpSchema);
export default RSVP;