import { gql } from "apollo-server-express";

/**
 * GraphQL Type Definitions for User, RSVP, Queries, and Mutations.
 */
const typeDefs = gql`
  """
  Represents a registered user.
  """
  type User {
    _id: ID!
    fullName: String!
    email: String!
    hasRSVPed: Boolean!
    rsvpId: ID
    rsvp: RSVP 
  }

  """
  Represents an RSVP entry for an event.
  """
  type RSVP {
    _id: ID!
    userId: ID!
    attending: Boolean!
    mealPreference: String!
    allergies: String
    additionalNotes: String
  }

  """
  Input type for submitting or updating an RSVP.
  """
  input RSVPInput {
    attending: Boolean!
    mealPreference: String!
    allergies: String
    additionalNotes: String
  }

  """
  Query type for fetching user and RSVP details.
  """
  type Query {
    """
    Retrieves the currently authenticated user's profile.
    """
    me: User

    """
    Retrieves the RSVP of the authenticated user.
    """
    getRSVP: RSVP
  }

  """
  Mutation type for authentication and RSVP management.
  """
  type Mutation {
    """
    Registers a new user and returns an authentication token.
    """
    registerUser(
      fullName: String!
      email: String!
      password: String!
    ): AuthPayload

    """
    Authenticates a user and returns a JWT token.
    """
    loginUser(email: String!, password: String!): AuthPayload

    """
    Submits an RSVP for the authenticated user.
    """
    submitRSVP(
      attending: Boolean!
      mealPreference: String!
      allergies: String
      additionalNotes: String
    ): RSVP

    """
    Updates an existing RSVP for the authenticated user.
    """
    editRSVP(updates: RSVPInput!): RSVP
  }

  """
  Authentication payload returned upon successful login or registration.
  """
  type AuthPayload {
    token: String!
    user: User!
  }
`;

export default typeDefs;
