import client from '../../../apolloClient';
import { SUBMIT_RSVP } from '../graphql/mutations';
import { RSVP, CreateRSVPInput } from '../types/rsvpTypes';

/**
 * Submits an RSVP via GraphQL submitRSVP mutation
 */
export const submitRSVP = async (formData: CreateRSVPInput): Promise<RSVP> => {
  try {
    const { data } = await client.mutate<{ submitRSVP: RSVP }>({
      mutation: SUBMIT_RSVP,
      variables: { ...formData },
    });
    if (!data?.submitRSVP) {
      throw new Error('No RSVP returned from server.');
    }
    return data.submitRSVP;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error submitting RSVP';
    console.error('RSVP submission error:', message);
    throw new Error(message);
  }
};
