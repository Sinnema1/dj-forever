import { useQuery, useMutation } from '@apollo/client';
import { GET_RSVP } from '../graphql/queries';
import { SUBMIT_RSVP, EDIT_RSVP } from '../graphql/mutations';
import { RSVP, CreateRSVPInput } from '../types/rsvpTypes';

/** Shape of the GET_RSVP response (single object) */
interface GetRSVPResponse {
  getRSVP: RSVP | null;
}

/** Shape of the submit RSVP mutation response */
interface SubmitRSVPResponse {
  submitRSVP: RSVP;
}

/** Shape of the edit RSVP mutation response */
interface EditRSVPResponse {
  editRSVP: RSVP;
}

export const useRSVP = () => {
  // Fetch the single RSVP
  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery<GetRSVPResponse>(GET_RSVP);

  // Mutation hook to submit RSVP
  const [executeSubmitRSVP, { loading: submitLoading, error: submitError }] =
    useMutation<SubmitRSVPResponse, CreateRSVPInput>(SUBMIT_RSVP);

  // Mutation hook to edit existing RSVP
  const [executeEditRSVP, { loading: editLoading, error: editError }] =
    useMutation<EditRSVPResponse, { updates: CreateRSVPInput }>(EDIT_RSVP);

  const submitRSVP = async (input: CreateRSVPInput): Promise<void> => {
    try {
      await executeSubmitRSVP({ variables: input });
      await refetch();
    } catch (err: unknown) {
      console.debug('Error submitting RSVP:', (err as Error).message);
      throw new Error((err as Error).message || 'Failed to submit RSVP');
    }
  };

  const editRSVP = async (updates: CreateRSVPInput): Promise<void> => {
    try {
      await executeEditRSVP({ variables: { updates } });
      await refetch();
    } catch (err: unknown) {
      console.debug('Error editing RSVP:', (err as Error).message);
      throw new Error((err as Error).message || 'Failed to edit RSVP');
    }
  };

  return {
    rsvp: data?.getRSVP ?? null,
    loading: queryLoading || submitLoading || editLoading,
    error: queryError || submitError || editError,
    submitRSVP,
    editRSVP,
  };
};
