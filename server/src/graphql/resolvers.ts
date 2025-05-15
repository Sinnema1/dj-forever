import {
  getUserById,
  getAllUsers,
  createUser,
  authenticateUser,
  updateUser,
} from "../services/userService.js";
import invitedEmails from "../config/invitedList.js";
import {
  submitRSVP as submitRSVPService,
  getRSVP as fetchRSVP,
  editRSVP as updateRSVPService,
} from "../services/rsvpService.js";
import { createError } from "../middleware/errorHandler.js";

/** Exact shape of the GraphQL RSVPInput */
interface RSVPInput {
  attending: "YES" | "NO" /* | "MAYBE" */;
  mealPreference: string;
  allergies?: string;
  additionalNotes?: string;
}

/** Context.user now includes both _id and email and isAdmin if you want role checks */
interface Context {
  user?: {
    _id: string;
    email: string;
    isAdmin?: boolean;
  };
}

const resolvers = {
  Query: {
    me: async (_p: any, _args: any, ctx: Context) => {
      if (!ctx.user) throw createError("Authentication required.", 401);
      return await getUserById(ctx.user._id);
    },

    getUsers: async (_p: any, _args: any, ctx: Context) => {
      if (!ctx.user) throw createError("Authentication required.", 401);
      if (!ctx.user.isAdmin) throw createError("Admin access required.", 403);
      return await getAllUsers();
    },

    getUserById: async (_p: any, { id }: { id: string }, ctx: Context) => {
      if (!ctx.user) throw createError("Authentication required.", 401);
      // non-admins only get their own record
      if (!ctx.user.isAdmin && ctx.user._id !== id) {
        throw createError("You can only view your own profile.", 403);
      }
      return await getUserById(id);
    },

    getRSVP: async (_p: any, _args: any, ctx: Context) => {
      if (!ctx.user) throw createError("Authentication required.", 401);
      const rsvp = await fetchRSVP(ctx.user._id);
      if (!rsvp) throw createError("No existing RSVP found.", 404);
      return rsvp;
    },
  },

  Mutation: {
    registerUser: (_p: any, args: any) =>
      createUser(args.fullName, args.email, args.password),

    loginUser: (_p: any, args: any) =>
      authenticateUser(args.email, args.password),

    /**
     * updateUser:
     * - Admins can update any user.
     * - Non-admins only themselves.
     */
    updateUser: async (
      _p: any,
      {
        id,
        input,
      }: { id: string; input: { fullName?: string; email?: string } },
      ctx: Context
    ) => {
      if (!ctx.user) throw createError("Authentication required.", 401);
      // only admins or the user themself may update
      if (!ctx.user.isAdmin && ctx.user._id !== id) {
        throw createError("You can only update your own profile.", 403);
      }
      return await updateUser(id, input);
    },

    submitRSVP: async (
      _p: any,
      { attending, mealPreference, allergies, additionalNotes }: RSVPInput,
      ctx: Context
    ) => {
      if (!ctx.user) throw createError("Authentication required.", 401);

      // we already have ctx.user.email
      if (!invitedEmails.includes(ctx.user.email)) {
        throw createError("You are not invited to RSVP.", 403);
      }

      // Prevent duplicates
      if (await fetchRSVP(ctx.user._id)) {
        throw createError("User has already submitted an RSVP.", 400);
      }

      // Map the enum back to a boolean
      const attendingBool = attending === "YES";
      return await submitRSVPService(
        ctx.user._id,
        attendingBool,
        mealPreference,
        allergies,
        additionalNotes
      );
    },

    editRSVP: async (
      _p: any,
      { updates }: { updates: RSVPInput },
      ctx: Context
    ) => {
      if (!ctx.user) throw createError("Authentication required.", 401);

      const existing = await fetchRSVP(ctx.user._id);
      if (!existing) throw createError("No existing RSVP found.", 404);

      const attendingBool = updates.attending === "YES";
      const updatePayload: {
        attending: boolean;
        mealPreference: string;
        allergies?: string;
        additionalNotes?: string;
      } = { attending: attendingBool, mealPreference: updates.mealPreference };

      if (updates.allergies !== undefined) {
        updatePayload.allergies = updates.allergies;
      }
      if (updates.additionalNotes !== undefined) {
        updatePayload.additionalNotes = updates.additionalNotes;
      }

      return await updateRSVPService(ctx.user._id, updatePayload);
    },
  },

  User: {
    // ensure rsvpId is serialized as a string ID
    rsvpId: (parent: any) => {
      if (!parent.rsvpId) return null;
      return typeof parent.rsvpId === "string"
        ? parent.rsvpId
        : parent.rsvpId._id?.toString();
    },

    // resolve the `rsvp` field when requested
    rsvp: async (parent: any) => {
      if (!parent.rsvpId) return null;
      return await fetchRSVP(parent._id);
    },
  },

  RSVP: {
    // boolean → enum mapping for GraphQL
    attending: (parent: any) => (parent.attending ? "YES" : "NO"),
  },
};

export default resolvers;
