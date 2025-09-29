/**
 * TypeScript interfaces dla API
 * Przykład czystego kodu z silnym typowaniem
 */

export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
}

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly category: ProductCategory;
  readonly description: string;
  readonly inStock: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  HOME = 'home',
  SPORTS = 'sports'
}

export interface CreateProductRequest {
  name: string;
  price: number;
  category: ProductCategory;
  description: string;
  inStock?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  category?: ProductCategory;
  description?: string;
  inStock?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface ApiError {
  error: {
    message: string;
    statusCode: number;
    timestamp: string;
    path: string;
    method: string;
  };
}
