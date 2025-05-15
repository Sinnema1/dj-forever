import { gql } from '@apollo/client';

/**
 * Submit an RSVP for the authenticated user
 */
export const SUBMIT_RSVP = gql`
  mutation SubmitRSVP(
    $attending: AttendanceStatus!
    $mealPreference: String!
    $allergies: String
    $additionalNotes: String
  ) {
    submitRSVP(
      attending: $attending
      mealPreference: $mealPreference
      allergies: $allergies
      additionalNotes: $additionalNotes
    ) {
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
 * Edit an existing RSVP for the authenticated user
 */
export const EDIT_RSVP = gql`
  mutation EditRSVP($updates: RSVPInput!) {
    editRSVP(updates: $updates) {
      _id
      attending
      mealPreference
      allergies
      additionalNotes
      createdAt
      updatedAt
    }
  }
`;