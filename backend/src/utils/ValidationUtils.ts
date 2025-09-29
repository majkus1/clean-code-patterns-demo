/**
 * Utility functions demonstrating clean code principles
 * Single Responsibility Principle - each function has one clear purpose
 */

/**
 * Email validation utility
 * Pure function - no side effects, predictable output
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Name validation utility
 * Clear validation rules, easy to test and modify
 */
export const isValidName = (name: string): boolean => {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  const trimmedName = name.trim();
  return trimmedName.length >= 2 && trimmedName.length <= 100;
};

/**
 * Price validation utility
 * Type-safe validation with clear error conditions
 */
export const isValidPrice = (price: number): boolean => {
  if (typeof price !== 'number' || isNaN(price)) {
    return false;
  }
  
  return price > 0 && price <= 999999.99;
};

/**
 * Generic string validation utility
 * Reusable function following DRY principle
 */
export const isValidString = (
  value: string, 
  minLength: number = 1, 
  maxLength: number = 1000
): boolean => {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  const trimmedValue = value.trim();
  return trimmedValue.length >= minLength && trimmedValue.length <= maxLength;
};

/**
 * Validation result type for better error handling
 * Type safety and clear error messages
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * User validation with detailed error messages
 * Open/Closed Principle - easy to extend with new validation rules
 */
export const validateUser = (userData: {
  email?: string;
  name?: string;
}): ValidationResult => {
  const errors: string[] = [];
  
  if (!isValidEmail(userData.email || '')) {
    errors.push('Email jest wymagany i musi mieć poprawny format');
  }
  
  if (!isValidName(userData.name || '')) {
    errors.push('Nazwa jest wymagana i musi mieć od 2 do 100 znaków');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Product validation with business rules
 * Demonstrates domain-specific validation logic
 */
export const validateProduct = (productData: {
  name?: string;
  price?: number;
  description?: string;
}): ValidationResult => {
  const errors: string[] = [];
  
  if (!isValidString(productData.name || '', 2, 200)) {
    errors.push('Nazwa produktu jest wymagana i musi mieć od 2 do 200 znaków');
  }
  
  if (!isValidPrice(productData.price || 0)) {
    errors.push('Cena jest wymagana i musi być liczbą większą od 0');
  }
  
  if (!isValidString(productData.description || '', 10, 1000)) {
    errors.push('Opis produktu jest wymagany i musi mieć od 10 do 1000 znaków');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitization utilities for security
 * Input sanitization to prevent injection attacks
 */
export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .substring(0, 1000); // Limit length
};

/**
 * Normalization utilities for consistency
 * Consistent data formatting across the application
 */
export const normalizeEmail = (email: string): string => {
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }
  
  return email.toLowerCase().trim();
};

export const normalizeName = (name: string): string => {
  if (!isValidName(name)) {
    throw new Error('Invalid name format');
  }
  
  return name.trim();
};
