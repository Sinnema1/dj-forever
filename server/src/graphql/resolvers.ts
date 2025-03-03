import {
  getUserById,
  createUser,
  authenticateUser,
} from "../services/userService.js";
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
  };
}

const resolvers = {
  Query: {
    /**
     * Retrieves the currently authenticated user's profile.
     * @returns {Promise<User>} Authenticated user data.
     */
    me: async (_parent: any, _args: any, context: Context) => {
      try {
        if (!context.user) throw createError("Authentication required.", 401);
        return await getUserById(context.user._id);
      } catch (error: any) {
        throw createError(`Failed to retrieve user: ${error.message}`, 500);
      }
    },

    /**
     * Retrieves the RSVP for the authenticated user.
     * @returns {Promise<RSVP>} The RSVP details.
     */
    getRSVP: async (_parent: any, _args: any, context: Context) => {
      try {
        if (!context.user) throw createError("Authentication required.", 401);
        const rsvp = await getRSVP(context.user._id);
        if (!rsvp) throw createError("No RSVP found for this user.", 404);
        return rsvp;
      } catch (error: any) {
        throw createError(`Failed to retrieve RSVP: ${error.message}`, 500);
      }
    },
  },

  Mutation: {
    /**
     * Registers a new user and returns an authentication token.
     * @returns {Promise<{ token: string; user: User }>}
     */
    registerUser: async (
      _parent: any,
      { fullName, email, password }: UserInput
    ) => {
      try {
        return await createUser(fullName, email, password);
      } catch (error: any) {
        throw createError(`User registration failed: ${error.message}`, 400);
      }
    },

    /**
     * Authenticates a user and returns a JWT token.
     * @returns {Promise<{ token: string; user: User }>}
     */
    loginUser: async (_parent: any, { email, password }: LoginInput) => {
      try {
        return await authenticateUser(email, password);
      } catch (error: any) {
        throw createError(`Authentication failed: ${error.message}`, 401);
      }
    },

    /**
     * Submits an RSVP for the authenticated user.
     * Ensures a user cannot submit multiple RSVPs.
     * @returns {Promise<RSVP>}
     */
    submitRSVP: async (
      _parent: any,
      { attending, mealPreference, allergies, additionalNotes }: RSVPInput,
      context: Context
    ) => {
      try {
        if (!context.user) throw createError("Authentication required.", 401);

        const existingRSVP = await getRSVP(context.user._id);
        if (existingRSVP) throw createError("User has already submitted an RSVP.", 400);

        return await submitRSVP(
          context.user._id,
          attending,
          mealPreference,
          allergies,
          additionalNotes
        );
      } catch (error: any) {
        throw createError(`RSVP submission failed: ${error.message}`, 400);
      }
    },

    /**
     * Updates an existing RSVP for the authenticated user.
     * Ensures RSVP exists before updating.
     * @returns {Promise<RSVP>}
     */
    editRSVP: async (
      _parent: any,
      { updates }: { updates: RSVPInput },
      context: Context
    ) => {
      try {
        if (!context.user) throw createError("Authentication required.", 401);

        const existingRSVP = await getRSVP(context.user._id);
        if (!existingRSVP) throw createError("No RSVP found to update.", 404);

        return await editRSVP(context.user._id, updates);
      } catch (error: any) {
        throw createError(`RSVP update failed: ${error.message}`, 400);
      }
    },
  },
};

export default resolvers;