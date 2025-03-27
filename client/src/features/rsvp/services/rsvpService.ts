import { ApolloClient, gql } from '@apollo/client';
// Make sure the path to your apolloClient is correct
import client from '../../../apolloClient';
import { CREATE_RSVP } from '../graphql/mutations';
import { RSVP } from '../types/rsvpTypes';

/**
 * Input type for creating an RSVP.
 * Adjust as necessary to match your GraphQL schema.
 */
export interface CreateRSVPInput {
  fullName: string;
  email: string;
  attending: string; // e.g. "yes", "no", "maybe"
  guests?: number;
  notes?: string;
}

/**
 * Submits an RSVP using the Apollo Client.
 *
 * @param formData - Data to create a new RSVP.
 * @returns The created RSVP.
 * @throws An error if the mutation fails.
 */
export const submitRSVP = async (
  formData: CreateRSVPInput
): Promise<RSVP> => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_RSVP,
      variables: { input: formData },
    });
    return data.createRSVP;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('RSVP submission error:', error.message);
      throw new Error(error.message);
    }
    console.error('Unknown error creating RSVP:', error);
    throw new Error('An unknown error occurred while creating RSVP.');
  }
};