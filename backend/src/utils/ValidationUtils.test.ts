import {
  isValidEmail,
  isValidName,
  isValidPrice,
  isValidString,
  validateUser,
  validateProduct,
  sanitizeString,
  normalizeEmail,
  normalizeName
} from './ValidationUtils';

describe('ValidationUtils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidEmail('  test@example.com  ')).toBe(true);
      expect(isValidEmail(null as any)).toBe(false);
      expect(isValidEmail(undefined as any)).toBe(false);
      expect(isValidEmail(123 as any)).toBe(false);
    });
  });

  describe('isValidName', () => {
    it('should validate correct names', () => {
      expect(isValidName('John Doe')).toBe(true);
      expect(isValidName('Anna')).toBe(true);
      expect(isValidName('  Valid Name  ')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(isValidName('')).toBe(false);
      expect(isValidName('A')).toBe(false);
      expect(isValidName('  ')).toBe(false);
      expect(isValidName('a'.repeat(101))).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidName(null as any)).toBe(false);
      expect(isValidName(undefined as any)).toBe(false);
      expect(isValidName(123 as any)).toBe(false);
    });
  });

  describe('isValidPrice', () => {
    it('should validate correct prices', () => {
      expect(isValidPrice(10)).toBe(true);
      expect(isValidPrice(0.01)).toBe(true);
      expect(isValidPrice(999999.99)).toBe(true);
    });

    it('should reject invalid prices', () => {
      expect(isValidPrice(0)).toBe(false);
      expect(isValidPrice(-10)).toBe(false);
      expect(isValidPrice(1000000)).toBe(false);
      expect(isValidPrice(NaN)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidPrice('10' as any)).toBe(false);
      expect(isValidPrice(null as any)).toBe(false);
      expect(isValidPrice(undefined as any)).toBe(false);
    });
  });

  describe('isValidString', () => {
    it('should validate strings with default parameters', () => {
      expect(isValidString('hello')).toBe(true);
      expect(isValidString('  hello  ')).toBe(true);
      expect(isValidString('')).toBe(false);
    });

    it('should validate strings with custom parameters', () => {
      expect(isValidString('hello', 3, 10)).toBe(true);
      expect(isValidString('hi', 3, 10)).toBe(false);
      expect(isValidString('hello world', 3, 5)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidString(null as any)).toBe(false);
      expect(isValidString(undefined as any)).toBe(false);
      expect(isValidString(123 as any)).toBe(false);
    });
  });

  describe('validateUser', () => {
    it('should validate correct user data', () => {
      const result = validateUser({
        email: 'test@example.com',
        name: 'John Doe'
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid user data', () => {
      const result = validateUser({
        email: 'invalid-email',
        name: 'A'
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0]).toContain('Email');
      expect(result.errors[1]).toContain('Nazwa');
    });

    it('should handle missing fields', () => {
      const result = validateUser({});

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  describe('validateProduct', () => {
    it('should validate correct product data', () => {
      const result = validateProduct({
        name: 'Test Product',
        price: 99.99,
        description: 'This is a test product description'
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid product data', () => {
      const result = validateProduct({
        name: 'A',
        price: -10,
        description: 'Short'
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  describe('sanitizeString', () => {
    it('should sanitize potentially dangerous strings', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeString('javascript:alert("xss")')).toBe('alert("xss")');
      expect(sanitizeString('  hello world  ')).toBe('hello world');
    });

    it('should limit string length', () => {
      const longString = 'a'.repeat(2000);
      const sanitized = sanitizeString(longString);
      expect(sanitized.length).toBe(1000);
    });

    it('should handle edge cases', () => {
      expect(sanitizeString('')).toBe('');
      expect(sanitizeString(null as any)).toBe('');
      expect(sanitizeString(undefined as any)).toBe('');
    });
  });

  describe('normalizeEmail', () => {
    it('should normalize valid emails', () => {
      expect(normalizeEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com');
      expect(normalizeEmail('User.Name@Domain.Co.Uk')).toBe('user.name@domain.co.uk');
    });

    it('should throw error for invalid emails', () => {
      expect(() => normalizeEmail('invalid-email')).toThrow('Invalid email format');
      expect(() => normalizeEmail('')).toThrow('Invalid email format');
    });
  });

  describe('normalizeName', () => {
    it('should normalize valid names', () => {
      expect(normalizeName('  John Doe  ')).toBe('John Doe');
      expect(normalizeName('Anna')).toBe('Anna');
    });

    it('should throw error for invalid names', () => {
      expect(() => normalizeName('')).toThrow('Invalid name format');
      expect(() => normalizeName('A')).toThrow('Invalid name format');
    });
  });
});
