import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS, GET_USER_BY_ID } from '../graphql/queries';
import { UPDATE_USER, DELETE_USER } from '../graphql/mutations';
import { UserType, UpdateUserInput } from '../types/userTypes';

interface GetUsersResponse {
  getUsers: UserType[];
}

interface GetUserByIdResponse {
  getUserById: UserType;
}

interface UpdateUserResponse {
  updateUser: UserType;
}

interface DeleteUserResponse {
  deleteUser: { _id: string };
}

export const useUsers = (userId?: string) => {
  // Fetch all users (for admin views)
  const {
    data: allUsersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery<GetUsersResponse>(GET_USERS);

  // Fetch a single user by ID (for profile views)
  const {
    data: userByIdData,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery<GetUserByIdResponse>(GET_USER_BY_ID, {
    skip: !userId,
    variables: { id: userId },
  });

  // Mutation to update a user
  const [updateUserMutation] = useMutation<
    UpdateUserResponse,
    { id: string; input: UpdateUserInput }
  >(UPDATE_USER);

  // Mutation to delete a user
  const [deleteUserMutation] = useMutation<DeleteUserResponse, { id: string }>(DELETE_USER);

  /**
   * Updates the user and refetches the latest profile data.
   * @param id - The user ID to update.
   * @param input - The updated user information.
   */
  const updateUser = async (id: string, input: UpdateUserInput): Promise<void> => {
    await updateUserMutation({ variables: { id, input } });
    // Explicitly check before calling refetchUser to satisfy ESLint
    if (refetchUser) {
      refetchUser();
    }
  };

  /**
   * Deletes a user and refetches the user list.
   * @param id - The user ID to delete.
   */
  const deleteUser = async (id: string): Promise<void> => {
    await deleteUserMutation({ variables: { id } });
    refetchUsers();
  };

  return {
    allUsers: allUsersData?.getUsers || [],
    user: userByIdData?.getUserById || null,
    loading: usersLoading || userLoading,
    error: usersError || userError,
    refetchUsers,
    updateUser,
    deleteUser,
  };
};
