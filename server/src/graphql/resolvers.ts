import {
  getUserById,
  createUser,
  authenticateUser,
} from "../services/userService.js";

import invitedEmails from '../config/invitedList.js';

import { submitRSVP, getRSVP, editRSVP } from "../services/rsvpService.js";

import { createError } from "../middleware/errorHandler.js";

/**
 * Defines input fields for user registration.
 */
interface UserInput {
  fullName: string;
  email: string;
  password: string;
}

/**
 * Defines input fields for user login.
 */
interface LoginInput {
  email: string;
  password: string;
}

/**
 * Defines input fields for RSVP submission.
 */
interface RSVPInput {
  attending: boolean;
  mealPreference: string;
  allergies?: string;
  additionalNotes?: string;
}

/**
 * Defines the GraphQL context, which includes authenticated user data.
 */
interface Context {
  user?: {
    _id: string;
    // Optionally, if available, include email here so you can avoid an extra DB call:
    // email: string;
  };
}

const resolvers = {
  Query: {
    /**
     * Retrieves the currently authenticated user's profile.
     * @returns {Promise<UserType>} Authenticated user data.
     */
    me: async (_parent: any, _args: any, context: Context) => {
      try {
        if (!context.user)
          throw createError("Authentication required.", 401);

        return await getUserById(context.user._id);
      } catch (error: any) {
        if (error.statusCode) throw error; // Pass through known errors
        throw createError(`Failed to retrieve user: ${error.message}`, 500);
      }
    },

    /**
     * Retrieves the RSVP for the authenticated user.
     * @returns {Promise<RSVP>} The RSVP details.
     */
    getRSVP: async (_parent: any, _args: any, context: Context) => {
      try {
        if (!context.user)
          throw createError("Authentication required.", 401);

        const rsvp = await getRSVP(context.user._id);
        if (!rsvp)
          throw createError("No existing RSVP found for this user.", 404);

        return rsvp;
      } catch (error: any) {
        if (error.statusCode) throw error;
        throw createError(`Failed to retrieve RSVP: ${error.message}`, 500);
      }
    },
  },

  Mutation: {
    /**
     * Registers a new user and returns an authentication token.
     * @returns {Promise<{ token: string; user: UserType }>} Authentication token and user details.
     */
    registerUser: async (_parent: any, { fullName, email, password }: UserInput) => {
      try {
        return await createUser(fullName, email, password);
      } catch (error: any) {
        if (error.statusCode) throw error;
        throw createError(`User registration failed: ${error.message}`, 400);
      }
    },

    /**
     * Authenticates a user and returns a JWT token.
     * @returns {Promise<{ token: string; user: UserType }>} Authentication token and user details.
     */
    loginUser: async (_parent: any, { email, password }: LoginInput) => {
      try {
        return await authenticateUser(email, password);
      } catch (error: any) {
        if (error.statusCode) throw error;
        throw createError(`Authentication failed: ${error.message}`, 401);
      }
    },

    /**
     * Submits an RSVP for the authenticated user.
     * Ensures that only invited users can submit an RSVP and prevents duplicate submissions.
     * @returns {Promise<RSVP>} The submitted RSVP details.
     */
    submitRSVP: async (
      _parent: any,
      { attending, mealPreference, allergies, additionalNotes }: RSVPInput,
      context: Context
    ) => {
      try {
        // Ensure the user is authenticated.
        if (!context.user)
          throw createError("Authentication required.", 401);

        // Retrieve the current user details to check email against the invited list.
        const currentUser = await getUserById(context.user._id);
        if (!currentUser || !invitedEmails.includes(currentUser.email)) {
          throw createError("You are not invited to RSVP.", 403);
        }

        // Prevent duplicate RSVPs.
        const existingRSVP = await getRSVP(context.user._id);
        if (existingRSVP)
          throw createError("User has already submitted an RSVP.", 400);

        // Call the service function to create the RSVP.
        return await submitRSVP(
          context.user._id,
          attending,
          mealPreference,
          allergies,
          additionalNotes
        );
      } catch (error: any) {
        if (error.statusCode) throw error;
        throw createError(`RSVP submission failed: ${error.message}`, 400);
      }
    },

    /**
     * Updates an existing RSVP for the authenticated user.
     * Ensures the RSVP exists before updating.
     * @returns {Promise<RSVP>} The updated RSVP details.
     */
    editRSVP: async (
      _parent: any,
      { updates }: { updates: RSVPInput },
      context: Context
    ) => {
      try {
        if (!context.user)
          throw createError("Authentication required.", 401);

        const existingRSVP = await getRSVP(context.user._id);
        if (!existingRSVP)
          throw createError("No existing RSVP found for this user.", 404);

        return await editRSVP(context.user._id, updates);
      } catch (error: any) {
        if (error.statusCode) throw error;
        throw createError(`RSVP update failed: ${error.message}`, 400);
      }
    },
  },

  /**
   * Field resolvers for the User type.
   * Handles nested or computed fields that are not directly available in the User model.
   */
  User: {
    rsvp: async (parent: any) => {
      try {
        // If the user doesn't have an RSVP ID, return null.
        if (!parent.rsvpId) return null;

        // Optionally, if your model links RSVP by user ID, adjust this call accordingly.
        const rsvp = await getRSVP(parent._id);
        return rsvp;
      } catch (error: any) {
        if (error.statusCode) throw error;
        throw createError(`Failed to load RSVP: ${error.message}`, 500);
      }
    },
  },
};

export default resolvers;