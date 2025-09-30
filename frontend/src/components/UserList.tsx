import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { User } from '../types/api';
import { UserForm } from './UserForm';
import { UserCard } from './UserCard';

/**
 * Component Pattern - UserList
 * Separation of concerns - presentation logic only
 */
export const UserList: React.FC = () => {
  const {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    isCreating,
    isUpdating,
    isDeleting
  } = useUsers();

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreateUser = async (userData: { email: string; name: string }) => {
    try {
      await new Promise<void>((resolve, reject) => {
        createUser(userData, {
          onSuccess: () => {
            setShowForm(false);
            resolve();
          },
          onError: reject
        });
      });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleUpdateUser = async (id: string, updates: { email?: string; name?: string }) => {
    try {
      await new Promise<void>((resolve, reject) => {
        updateUser({ id, updates }, {
          onSuccess: () => {
            setEditingUser(null);
            resolve();
          },
          onError: reject
        });
      });
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await new Promise<void>((resolve, reject) => {
          deleteUser(id, {
            onSuccess: () => resolve(),
            onError: reject
          });
        });
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h2>Users List</h2>
        <button 
          onClick={() => setShowForm(true)}
          disabled={isCreating}
          className="btn btn-primary"
        >
          {isCreating ? 'Creating...' : 'Add User'}
        </button>
      </div>

      {showForm && (
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => setShowForm(false)}
          isSubmitting={isCreating}
        />
      )}

      {editingUser && (
        <UserForm
          user={editingUser}
          onSubmit={(updates) => handleUpdateUser(editingUser.id, updates)}
          onCancel={() => setEditingUser(null)}
          isSubmitting={isUpdating}
        />
      )}

      <div className="user-grid">
        {users.length === 0 ? (
          <p className="empty-state">No users to display</p>
        ) : (
          users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => setEditingUser(user)}
              onDelete={() => handleDeleteUser(user.id)}
              isDeleting={isDeleting}
            />
          ))
        )}
      </div>
    </div>
  );
};
