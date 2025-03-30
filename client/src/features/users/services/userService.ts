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
  // Fetch all users (for admin view)
  const {
    data: allUsersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery<GetUsersResponse>(GET_USERS);

  // Fetch single user by ID (for profile)
  const {
    data: userByIdData,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery<GetUserByIdResponse>(GET_USER_BY_ID, {
    skip: !userId,
    variables: { id: userId },
  });

  // Mutation for updating a user
  const [updateUserMutation] = useMutation<
    UpdateUserResponse,
    { id: string; input: UpdateUserInput }
  >(UPDATE_USER);

  // Mutation for deleting a user
  const [deleteUserMutation] = useMutation<DeleteUserResponse, { id: string }>(DELETE_USER);

  /**
   * Updates the user and refetches user data.
   * @param id - The user ID.
   * @param input - The update payload.
   */
  const updateUser = async (id: string, input: UpdateUserInput) => {
    await updateUserMutation({ variables: { id, input } });
    // Explicitly check and call refetchUser to satisfy ESLint rules
    if (refetchUser) {
      refetchUser();
    }
  };

  /**
   * Deletes a user and refetches the user list.
   * @param id - The user ID.
   */
  const deleteUser = async (id: string) => {
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
