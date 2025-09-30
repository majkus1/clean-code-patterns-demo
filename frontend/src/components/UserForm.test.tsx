import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserForm } from './UserForm';
import { User } from '../types/api';

const mockProps = {
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  isSubmitting: false
};

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

describe('UserForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders create form when no user provided', () => {
    render(<UserForm {...mockProps} />);
    
    expect(screen.getByText('Add New User')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('')).toHaveLength(2);
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('renders edit form when user provided', () => {
    render(<UserForm {...mockProps} user={mockUser} />);
    
    expect(screen.getByText('Edit User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<UserForm {...mockProps} />);
    
    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
    
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    render(<UserForm {...mockProps} />);
    
    const emailInput = screen.getByLabelText('Email:');
    const submitButton = screen.getByText('Create');
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Test User' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
    
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('validates name length', async () => {
    render(<UserForm {...mockProps} />);
    
    const nameInput = screen.getByLabelText('Name:');
    const submitButton = screen.getByText('Create');
    
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(nameInput, { target: { value: 'A' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
    
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<UserForm {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Test User' } });
    
    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User'
      });
    });
  });

  it('trims whitespace from inputs', async () => {
    render(<UserForm {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: '  test@example.com  ' } });
    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: '  Test User  ' } });
    
    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User'
      });
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<UserForm {...mockProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('disables form when isSubmitting', () => {
    render(<UserForm {...mockProps} isSubmitting={true} />);
    
    expect(screen.getByLabelText('Email:')).toBeDisabled();
    expect(screen.getByLabelText('Name:')).toBeDisabled();
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });

  it('clears errors when user starts typing', async () => {
    render(<UserForm {...mockProps} />);
    
    const emailInput = screen.getByLabelText('Email:');
    const submitButton = screen.getByText('Create');
    
    // Submit to trigger validation
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
    
    // Start typing to clear error
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });
});
