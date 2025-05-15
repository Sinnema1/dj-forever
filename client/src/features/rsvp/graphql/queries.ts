import { gql } from '@apollo/client';

/**
 * Get the RSVP for the currently authenticated user
 */
export const GET_RSVP = gql`
  query GetRSVP {
    getRSVP {
      _id
      attending
      mealPreference
      allergies
      additionalNotes
      createdAt
    }
  }
`;

/**
 * If you later add an admin endpoint to fetch by ID, you can
 * reinstate or adapt this query. For now, remove/comment it out,
 * since `getRSVPById` doesn’t exist and fields like fullName/email/guests aren’t on RSVP.
 */
// export const GET_RSVP_BY_ID = gql`
//   query GetRSVPById($id: ID!) {
//     getRSVPById(id: $id) {
//       _id
//       attending
//       mealPreference
//       allergies
//       additionalNotes
//       createdAt
//     }
//   }
// `;