import { gql } from '@apollo/client';

/**
 * Fetch the currently authenticated user's profile.
 */
export const GET_ME = gql`
  query Me {
    me {
      _id
      fullName
      email
      isAdmin
      isInvited
      hasRSVPed
      rsvpId
    }
  }
`;

/**
 * Fetch all users (admin-only).
 */
export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      _id
      fullName
      email
      isAdmin
      isInvited
      hasRSVPed
    }
  }
`;

/**
 * Fetch a single user by their ID (admin or self).
 */
export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      _id
      fullName
      email
      isAdmin
      isInvited
      hasRSVPed
    }
  }
`;