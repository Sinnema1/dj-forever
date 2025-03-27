import { useQuery, useMutation } from '@apollo/client';
import { GET_RSVPS } from '../graphql/queries';
import { CREATE_RSVP } from '../graphql/mutations';
import { RSVP, CreateRSVPInput } from '../types/rsvpTypes';

/**
 * Interface for GET_RSVPS GraphQL query response.
 */
interface GetRSVPsResponse {
  getRSVPs: RSVP[];
}

/**
 * Interface for CREATE_RSVP GraphQL mutation response.
 */
interface CreateRSVPResponse {
  createRSVP: RSVP;
}

/**
 * Custom hook to manage RSVP logic: fetch RSVPs and create new RSVP.
 */
export const useRSVP = () => {
  // Fetch RSVPs from backend
  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery<GetRSVPsResponse>(GET_RSVPS);

  // Mutation hook to create RSVP
  const [executeCreateRSVP, { loading: mutationLoading, error: mutationError }] = useMutation<
    CreateRSVPResponse,
    { input: CreateRSVPInput }
  >(CREATE_RSVP);

  /**
   * Create RSVP and refetch the RSVP list.
   * @param formData - Data to create an RSVP (CreateRSVPInput)
   */
  const createRSVP = async (formData: CreateRSVPInput): Promise<void> => {
    try {
      await executeCreateRSVP({
        variables: { input: formData },
      });

      // Refetch RSVP list after creation
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
    rsvps: data?.getRSVPs || [],
    loading: queryLoading || mutationLoading,
    error: queryError || mutationError,
    createRSVP,
  };
};
