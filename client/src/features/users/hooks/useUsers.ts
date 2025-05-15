import { useQuery, useMutation } from '@apollo/client';
import {
  GET_ME,
  GET_USERS,
  GET_USER_BY_ID,
} from '../graphql/queries';
import { UPDATE_USER, DELETE_USER } from '../graphql/mutations';
import {
  UserType,
  UpdateUserInput,
} from '../types/userTypes';

interface MeResponse { me: UserType }
interface GetUsersResponse { getUsers: UserType[] }
interface GetUserByIdResponse { getUserById: UserType }
interface UpdateUserResponse { updateUser: UserType }
interface DeleteUserResponse { deleteUser: { _id: string } }

export const useMe = () => {
  const { data, loading, error, refetch } = useQuery<MeResponse>(GET_ME);
  return {
    user: data?.me ?? null,
    loading,
    error,
    refetch,
  };
};

/** Admin‐only list + self‐by‐id */
export const useUsers = (userId?: string) => {
  const {
    data: allUsersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery<GetUsersResponse>(GET_USERS, {
    skip: !userId, // skip unless we have an id to check admin on server
  });

  const {
    data: userByIdData,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery<GetUserByIdResponse>(GET_USER_BY_ID, {
    skip: !userId,
    variables: { id: userId },
  });

  const [updateUserMutation] = useMutation<
    UpdateUserResponse,
    { id: string; input: UpdateUserInput }
  >(UPDATE_USER);
  const [deleteUserMutation] = useMutation<
    DeleteUserResponse,
    { id: string }
  >(DELETE_USER);

  const updateUser = async (id: string, input: UpdateUserInput) => {
    await updateUserMutation({ variables: { id, input } });
    refetchUser?.();
  };

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