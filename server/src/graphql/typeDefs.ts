import { gql } from "graphql-tag";

export default gql`
  """
  Enum representing the RSVP attendance status.
  """
  enum AttendanceStatus {
    YES
    NO
    MAYBE
  }

  """
  Represents a registered user.
  """
  type User {
    _id: ID!
    fullName: String!
    email: String!
    isAdmin: Boolean!
    isInvited: Boolean!
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
    attending: AttendanceStatus!
    mealPreference: String!
    allergies: String
    additionalNotes: String
    createdAt: String!
  }

  """
  Input type for submitting or updating an RSVP.
  """
  input RSVPInput {
    attending: AttendanceStatus!
    mealPreference: String!
    allergies: String
    additionalNotes: String
  }

  """
  Input type for updating an existing user.
  """
  input UpdateUserInput {
    fullName: String
    email: String
  }

  type Query {
    """
    Retrieves the currently authenticated user's profile.
    """
    me: User

    """
    Retrieves all users (admin only).
    """
    getUsers: [User!]!

    """
    Retrieves a user by ID (admin or self).
    """
    getUserById(id: ID!): User

    """
    Retrieves the RSVP of the authenticated user.
    """
    getRSVP: RSVP
  }

  type Mutation {
    """
    Registers a new user and returns an authentication token.
    """
    registerUser(fullName: String!, email: String!, password: String!): AuthPayload

    """
    Authenticates a user and returns a JWT token.
    """
    loginUser(email: String!, password: String!): AuthPayload

    """
    Submits an RSVP for the authenticated user.
    """
    submitRSVP(
      attending: AttendanceStatus!
      mealPreference: String!
      allergies: String
      additionalNotes: String
    ): RSVP

    """
    Updates an existing RSVP for the authenticated user.
    """
    editRSVP(updates: RSVPInput!): RSVP

    """
    Updates an existing user's name and/or email.
    """
    updateUser(id: ID!, input: UpdateUserInput!): User!
  }

  """
  Authentication payload returned upon successful login or registration.
  """
  type AuthPayload {
    token: String!
    user: User!
  }
`;