import React, { useState, useEffect } from 'react';
import { User } from '../types/api';

interface UserFormProps {
  user?: User;
  onSubmit: (data: { email: string; name: string }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

/**
 * Form Component Pattern
 * Reusable form with validation
 */
export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        name: user.name
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Nazwa jest wymagana';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nazwa musi mieć co najmniej 2 znaki';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        email: formData.email.trim(),
        name: formData.name.trim()
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="user-form-overlay">
      <div className="user-form">
        <h3>{user ? 'Edytuj Użytkownika' : 'Dodaj Nowego Użytkownika'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="name">Nazwa:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="btn btn-secondary"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Zapisywanie...' : (user ? 'Zaktualizuj' : 'Utwórz')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
