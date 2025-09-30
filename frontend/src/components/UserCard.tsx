import React from 'react';
import { User } from '../types/api';

interface UserCardProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

/**
 * Card Component Pattern
 * Reusable UI component with clear props interface
 */
export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  isDeleting
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        <h3>{user.name}</h3>
        <div className="user-card-actions">
          <button
            onClick={onEdit}
            className="btn btn-small btn-secondary"
            title="Edit user"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="btn btn-small btn-danger"
            title="Delete user"
          >
            {isDeleting ? '⏳' : '🗑️'}
          </button>
        </div>
      </div>
      
      <div className="user-card-content">
        <p className="user-email">
          <strong>Email:</strong> {user.email}
        </p>
        
        <div className="user-dates">
          <p className="user-date">
            <strong>Created:</strong> {formatDate(user.createdAt)}
          </p>
          {user.updatedAt !== user.createdAt && (
            <p className="user-date">
              <strong>Updated:</strong> {formatDate(user.updatedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
