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
    
    expect(screen.getByText('Dodaj Nowego Użytkownika')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('')).toHaveLength(2);
    expect(screen.getByText('Utwórz')).toBeInTheDocument();
  });

  it('renders edit form when user provided', () => {
    render(<UserForm {...mockProps} user={mockUser} />);
    
    expect(screen.getByText('Edytuj Użytkownika')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByText('Zaktualizuj')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<UserForm {...mockProps} />);
    
    const submitButton = screen.getByText('Utwórz');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email jest wymagany')).toBeInTheDocument();
      expect(screen.getByText('Nazwa jest wymagana')).toBeInTheDocument();
    });
    
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    render(<UserForm {...mockProps} />);
    
    const emailInput = screen.getByLabelText('Email:');
    const submitButton = screen.getByText('Utwórz');
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText('Nazwa:'), { target: { value: 'Test User' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Nieprawidłowy format email')).toBeInTheDocument();
    });
    
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('validates name length', async () => {
    render(<UserForm {...mockProps} />);
    
    const nameInput = screen.getByLabelText('Nazwa:');
    const submitButton = screen.getByText('Utwórz');
    
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(nameInput, { target: { value: 'A' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Nazwa musi mieć co najmniej 2 znaki')).toBeInTheDocument();
    });
    
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<UserForm {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Nazwa:'), { target: { value: 'Test User' } });
    
    const submitButton = screen.getByText('Utwórz');
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
    fireEvent.change(screen.getByLabelText('Nazwa:'), { target: { value: '  Test User  ' } });
    
    const submitButton = screen.getByText('Utwórz');
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
    
    const cancelButton = screen.getByText('Anuluj');
    fireEvent.click(cancelButton);
    
    expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('disables form when isSubmitting', () => {
    render(<UserForm {...mockProps} isSubmitting={true} />);
    
    expect(screen.getByLabelText('Email:')).toBeDisabled();
    expect(screen.getByLabelText('Nazwa:')).toBeDisabled();
    expect(screen.getByText('Zapisywanie...')).toBeInTheDocument();
    expect(screen.getByText('Anuluj')).toBeDisabled();
  });

  it('clears errors when user starts typing', async () => {
    render(<UserForm {...mockProps} />);
    
    const emailInput = screen.getByLabelText('Email:');
    const submitButton = screen.getByText('Utwórz');
    
    // Submit to trigger validation
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email jest wymagany')).toBeInTheDocument();
    });
    
    // Start typing to clear error
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Email jest wymagany')).not.toBeInTheDocument();
    });
  });
});
