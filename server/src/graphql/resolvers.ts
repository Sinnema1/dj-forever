import { GraphQLError } from "graphql/error";
import { Types } from "mongoose";
import { User, RSVP } from "../models/index.js";
import { signToken } from "../middleware/auth.js";
import bcrypt from "bcrypt";

interface UserInput {
  fullName: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface RSVPInput {
  attending: boolean;
  mealPreference: string;
  allergies?: string;
  additionalNotes?: string;
}

interface Context {
  user?: {
    _id: string;
    fullName: string;
    email: string;
  };
}

const resolvers = {
  Query: {
    /**
     * Retrieves the currently authenticated user's data (includes RSVP details).
     * @function me
     * @returns {Promise<User>} Authenticated user's profile with RSVP details.
     */
    me: async (_parent: any, _args: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError("Authentication required.", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      return await User.findById(context.user._id).populate("rsvpId");
    },
  },

  Mutation: {
    /**
     * Registers a new user (pre-created accounts, not public signup).
     * @function registerUser
     * @returns {Promise<{ token: string; user: User }>}
     */
    registerUser: async (_parent: any, { fullName, email, password }: UserInput) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new GraphQLError("User already exists.", { extensions: { code: "BAD_REQUEST" } });
        }

        const user = await User.create({ fullName, email, password });
        const token = signToken(user.fullName, user.email, user._id);
        return { token, user };
      } catch (error: any) {
        throw new GraphQLError(`User registration failed: ${error.message}`, { extensions: { code: "BAD_REQUEST" } });
      }
    },

    /**
     * Authenticates a user and returns a JWT token.
     * @function loginUser
     * @returns {Promise<{ token: string; user: User }>}
     */
    loginUser: async (_parent: any, { email, password }: LoginInput) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new GraphQLError("Invalid email or password.", { extensions: { code: "UNAUTHENTICATED" } });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new GraphQLError("Invalid email or password.", { extensions: { code: "UNAUTHENTICATED" } });
        }

        const token = signToken(user.fullName, user.email, user._id);
        return { token, user };
      } catch (error: any) {
        throw new GraphQLError(`Authentication failed: ${error.message}`, { extensions: { code: "UNAUTHENTICATED" } });
      }
    },

    /**
     * Submits an RSVP for an authenticated user.
     * @function submitRSVP
     * @returns {Promise<RSVP>} The newly created RSVP entry.
     */
    submitRSVP: async (_parent: any, { attending, mealPreference, allergies, additionalNotes }: RSVPInput, context: Context) => {
      if (!context.user) {
        throw new GraphQLError("Authentication required.", { extensions: { code: "UNAUTHENTICATED" } });
      }

      try {
        const user = await User.findById(context.user._id);
        if (!user) {
          throw new GraphQLError("User not found.", { extensions: { code: "NOT_FOUND" } });
        }

        // Prevent multiple RSVPs per user
        if (user.rsvpId) {
          throw new GraphQLError("RSVP already submitted.", { extensions: { code: "BAD_REQUEST" } });
        }

        // Create RSVP entry
        const newRSVP = await RSVP.create({
          userId: user._id,
          attending,
          mealPreference,
          allergies,
          additionalNotes,
        });

        // Update user with RSVP reference
        user.hasRSVPed = true;
        user.rsvpId = newRSVP._id;
        await user.save();

        return newRSVP;
      } catch (error: any) {
        throw new GraphQLError(`Error submitting RSVP: ${error.message}`, { extensions: { code: "BAD_REQUEST" } });
      }
    },

    /**
     * Retrieves an RSVP for an authenticated user.
     * @function getRSVP
     * @returns {Promise<RSVP>} The user's RSVP details.
     */
    getRSVP: async (_parent: any, _args: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError("Authentication required.", { extensions: { code: "UNAUTHENTICATED" } });
      }

      try {
        const rsvp = await RSVP.findOne({ userId: context.user._id });
        if (!rsvp) {
          throw new GraphQLError("RSVP not found.", { extensions: { code: "NOT_FOUND" } });
        }

        return rsvp;
      } catch (error: any) {
        throw new GraphQLError(`Error retrieving RSVP: ${error.message}`, { extensions: { code: "BAD_REQUEST" } });
      }
    },

    /**
     * Updates an existing RSVP.
     * @function editRSVP
     * @returns {Promise<RSVP>} The updated RSVP object.
     */
    editRSVP: async (_parent: any, { attending, mealPreference, allergies, additionalNotes }: RSVPInput, context: Context) => {
      if (!context.user) {
        throw new GraphQLError("Authentication required.", { extensions: { code: "UNAUTHENTICATED" } });
      }

      try {
        const rsvp = await RSVP.findOne({ userId: context.user._id });
        if (!rsvp) {
          throw new GraphQLError("RSVP not found.", { extensions: { code: "NOT_FOUND" } });
        }

        // Update RSVP details
        rsvp.attending = attending ?? rsvp.attending;
        rsvp.mealPreference = mealPreference ?? rsvp.mealPreference;
        rsvp.allergies = allergies ?? rsvp.allergies;
        rsvp.additionalNotes = additionalNotes ?? rsvp.additionalNotes;

        await rsvp.save();
        return rsvp;
      } catch (error: any) {
        throw new GraphQLError(`Error updating RSVP: ${error.message}`, { extensions: { code: "BAD_REQUEST" } });
      }
    },
  },
};

export default resolvers;