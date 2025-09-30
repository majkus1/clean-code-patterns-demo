import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductCategory,
  ApiResponse,
  ApiError
} from '../types/api';

/**
 * Service Layer Pattern - API Service
 * Centralizes API communication
 */
export class ApiService {
  private client: AxiosInstance;

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`Response received from ${response.config.url}:`, response.status);
        return response;
      },
      (error) => {
        console.error('Response error:', error.response?.data || error.message);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): ApiError {
    if (error.response?.data) {
      return error.response.data;
    }
    
    return {
      error: {
        message: error.message || 'An unexpected error occurred',
        statusCode: error.response?.status || 500,
        timestamp: new Date().toISOString(),
        path: error.config?.url || '',
        method: error.config?.method?.toUpperCase() || 'UNKNOWN'
      }
    };
  }

  // User API methods
  async createUser(userData: CreateUserRequest): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.post('/users', userData);
    return response.data.data;
  }

  async getAllUsers(): Promise<User[]> {
    const response: AxiosResponse<ApiResponse<User[]>> = await this.client.get('/users');
    return response.data.data;
  }

  async getUserById(id: string): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.get(`/users/${id}`);
    return response.data.data;
  }

  async updateUser(id: string, updates: UpdateUserRequest): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.put(`/users/${id}`, updates);
    return response.data.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.delete(`/users/${id}`);
  }

  async getUserByEmail(email: string): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.get('/users/email', {
      params: { email }
    });
    return response.data.data;
  }

  // Product API methods
  async createProduct(productData: CreateProductRequest): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.client.post('/products', productData);
    return response.data.data;
  }

  async getAllProducts(): Promise<Product[]> {
    const response: AxiosResponse<ApiResponse<Product[]>> = await this.client.get('/products');
    return response.data.data;
  }

  async getProductById(id: string): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.client.get(`/products/${id}`);
    return response.data.data;
  }

  async updateProduct(id: string, updates: UpdateProductRequest): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.client.put(`/products/${id}`, updates);
    return response.data.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.client.delete(`/products/${id}`);
  }

  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    const response: AxiosResponse<ApiResponse<Product[]>> = await this.client.get(`/products/category/${category}`);
    return response.data.data;
  }

  async getInStockProducts(): Promise<Product[]> {
    const response: AxiosResponse<ApiResponse<Product[]>> = await this.client.get('/products/in-stock');
    return response.data.data;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const response: AxiosResponse<ApiResponse<Product[]>> = await this.client.get('/products/search', {
      params: { q: query }
    });
    return response.data.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }
}
