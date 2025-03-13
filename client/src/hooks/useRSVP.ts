import { useQuery, useMutation } from '@apollo/client';
import { GET_RSVPS } from '../graphql/rsvp/queries';
import { CREATE_RSVP } from '../graphql/rsvp/mutations';

export const useRSVP = () => {
  const { data, loading, error, refetch } = useQuery(GET_RSVPS);
  const [createRSVPMutation] = useMutation(CREATE_RSVP);

  const createRSVP = async (formData: any) => {
    try {
      await createRSVPMutation({ variables: { ...formData } });
      refetch(); // Refresh RSVP list after adding
    } catch (err) {
      console.error('Error creating RSVP:', err);
    }
  };

  return {
    rsvps: data?.getRSVPs || [],
    loading,
    error,
    createRSVP,
  };
};
