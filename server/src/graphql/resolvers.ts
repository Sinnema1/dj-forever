import {
  getUserById,
  createUser,
  authenticateUser,
} from "../services/userService.js";
import { submitRSVP, getRSVP, editRSVP } from "../services/rsvpService.js";
import { createError } from "../middleware/errorHandler.js"; // ✅ Import createError for error handling

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
        return await getRSVP(context.user._id);
      } catch (error: any) {
        throw createError(`Failed to retrieve RSVP: ${error.message}`, 500);
      }
    },
  },

  Mutation: {
    /**
     * Registers a new user.
     * @returns {Promise<{ token: string; user: User }>} Authentication token and user details.
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
     * @returns {Promise<{ token: string; user: User }>} Authentication token and user details.
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
     * @returns {Promise<RSVP>} The submitted RSVP details.
     */
    submitRSVP: async (
      _parent: any,
      { attending, mealPreference, allergies, additionalNotes }: RSVPInput,
      context: Context
    ) => {
      try {
        if (!context.user) throw createError("Authentication required.", 401);
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
     * @returns {Promise<RSVP>} The updated RSVP details.
     */
    editRSVP: async (
      _parent: any,
      { updates }: { updates: RSVPInput },
      context: Context
    ) => {
      try {
        if (!context.user) throw createError("Authentication required.", 401);
        return await editRSVP(context.user._id, updates);
      } catch (error: any) {
        throw createError(`RSVP update failed: ${error.message}`, 400);
      }
    },
  },
};

export default resolvers;
