import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';
import { User } from '../types/api';

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockProps = {
  user: mockUser,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  isDeleting: false
};

describe('UserCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    render(<UserCard {...mockProps} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Created:')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<UserCard {...mockProps} />);
    
    const editButton = screen.getByTitle('Edit user');
    fireEvent.click(editButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<UserCard {...mockProps} />);
    
    const deleteButton = screen.getByTitle('Delete user');
    fireEvent.click(deleteButton);
    
    expect(mockProps.onDelete).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isDeleting is true', () => {
    render(<UserCard {...mockProps} isDeleting={true} />);
    
    const deleteButton = screen.getByTitle('Delete user');
    expect(deleteButton).toBeDisabled();
    expect(screen.getByText('⏳')).toBeInTheDocument();
  });

  it('shows updated date when different from created date', () => {
    const userWithUpdate: User = {
      ...mockUser,
      updatedAt: '2023-01-02T00:00:00.000Z'
    };
    
    render(<UserCard {...mockProps} user={userWithUpdate} />);
    
    expect(screen.getByText('Updated:')).toBeInTheDocument();
  });

  it('does not show updated date when same as created date', () => {
    render(<UserCard {...mockProps} />);
    
    expect(screen.queryByText('Updated:')).not.toBeInTheDocument();
  });
});
