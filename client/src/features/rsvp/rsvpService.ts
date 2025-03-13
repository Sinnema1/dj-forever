import { gql } from '@apollo/client';
import client from '../../utils/apiClient'; // or wherever you configure Apollo

export const CREATE_RSVP = gql`
  mutation CreateRSVP($name: String!, $email: String!, $attending: Boolean!) {
    createRSVP(name: $name, email: $email, attending: $attending) {
      _id
      name
      attending
    }
  }
`;

export const submitRSVP = async (formData: { name: string; email: string; attending: boolean }) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_RSVP,
      variables: formData,
    });
    return data.createRSVP;
  } catch (error) {
    console.error('RSVP submission error:', error);
    throw error;
  }
};
