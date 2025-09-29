import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../services/ApiService';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/api';

/**
 * Custom Hook Pattern
 * Encapsulates data fetching logic and provides clean interface
 */
const apiService = new ApiService();

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Query for all users
  const {
    data: users,
    isLoading,
    error,
    refetch
  } = useQuery<User[], Error>(
    'users',
    () => apiService.getAllUsers(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Mutation for creating user
  const createUserMutation = useMutation<User, Error, CreateUserRequest>(
    (userData) => apiService.createUser(userData),
    {
      onSuccess: () => {
        // Invalidate and refetch users list
        queryClient.invalidateQueries('users');
      },
    }
  );

  // Mutation for updating user
  const updateUserMutation = useMutation<
    User,
    Error,
    { id: string; updates: UpdateUserRequest }
  >(
    ({ id, updates }) => apiService.updateUser(id, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  // Mutation for deleting user
  const deleteUserMutation = useMutation<void, Error, string>(
    (id) => apiService.deleteUser(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  return {
    users: users || [],
    isLoading,
    error,
    refetch,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isCreating: createUserMutation.isLoading,
    isUpdating: updateUserMutation.isLoading,
    isDeleting: deleteUserMutation.isLoading,
    createError: createUserMutation.error,
    updateError: updateUserMutation.error,
    deleteError: deleteUserMutation.error,
  };
};

export const useUser = (id: string) => {
  return useQuery<User, Error>(
    ['user', id],
    () => apiService.getUserById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useUserByEmail = (email: string) => {
  return useQuery<User, Error>(
    ['userByEmail', email],
    () => apiService.getUserByEmail(email),
    {
      enabled: !!email,
      staleTime: 5 * 60 * 1000,
    }
  );
};
