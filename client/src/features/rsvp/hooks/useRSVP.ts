import { useQuery, useMutation } from '@apollo/client';
import { GET_RSVP } from '../graphql/queries';
import { CREATE_RSVP } from '../graphql/mutations';
import { RSVP, CreateRSVPInput } from '../types/rsvpTypes';

/**
 * Interface for GET_RSVP GraphQL query response.
 */
interface GetRSVPResponse {
  getRSVP: RSVP | null;
}

/**
 * Interface for CREATE_RSVP GraphQL mutation response.
 */
interface CreateRSVPResponse {
  createRSVP: RSVP;
}

/**
 * Custom hook to manage RSVP logic: fetch RSVP for the current user and create a new RSVP.
 */
export const useRSVP = () => {
  // Fetch the current user's RSVP from backend
  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery<GetRSVPResponse>(GET_RSVP);

  // Mutation hook to create RSVP
  const [executeCreateRSVP, { loading: mutationLoading, error: mutationError }] = useMutation<
    CreateRSVPResponse,
    { input: CreateRSVPInput }
  >(CREATE_RSVP);

  /**
   * Create RSVP and refetch the RSVP data.
   * @param formData - Data to create an RSVP (CreateRSVPInput)
   */
  const createRSVP = async (formData: CreateRSVPInput): Promise<void> => {
    try {
      await executeCreateRSVP({
        variables: { input: formData },
      });

      // Refetch RSVP data after creation
      await refetch();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error creating RSVP:', error.message);
        throw new Error(error.message);
      } else {
        console.error('Unknown error creating RSVP:', error);
        throw new Error('An unknown error occurred while creating RSVP.');
      }
    }
  };

  return {
    rsvp: data?.getRSVP || null,
    loading: queryLoading || mutationLoading,
    error: queryError || mutationError,
    createRSVP,
  };
};
