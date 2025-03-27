import { gql } from '@apollo/client';

/**
 * Get all RSVPs (Admin access or general list)
 */
export const GET_RSVPS = gql`
  query GetRSVPs {
    getRSVPs {
      _id
      fullName
      email
      attending
      guests
      notes
      createdAt
    }
  }
`;

/**
 * Get a single RSVP by ID (if you need it somewhere)
 */
export const GET_RSVP_BY_ID = gql`
  query GetRSVPById($id: ID!) {
    getRSVPById(id: $id) {
      _id
      fullName
      email
      attending
      guests
      notes
      createdAt
    }
  }
`;
