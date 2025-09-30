/**
 * Product model with design pattern examples
 */
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly category: ProductCategory;
  readonly description: string;
  readonly inStock: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
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

/**
 * Value Object - Money
 * Example of Domain-Driven Design
 */
export class Money {
  private readonly amount: number;
  private readonly currency: string;
  
  constructor(amount: number, currency: string = 'PLN') {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    if (!currency || currency.trim().length === 0) {
      throw new Error('Currency cannot be empty');
    }
    
    this.amount = Math.round(amount * 100) / 100; // Round to 2 decimal places
    this.currency = currency.toUpperCase();
  }
  
  public getAmount(): number {
    return this.amount;
  }
  
  public getCurrency(): string {
    return this.currency;
  }
  
  public add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }
  
  public subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    return new Money(this.amount - other.amount, this.currency);
  }
  
  public equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
  
  public toString(): string {
    return `${this.amount.toFixed(2)} ${this.currency}`;
  }
}

/**
 * Factory pattern for products
 */
export class ProductFactory {
  public static createProduct(
    id: string,
    name: string,
    price: number,
    category: ProductCategory,
    description: string,
    inStock: boolean = true
  ): Product {
    this.validateProduct(name, price, description);
    
    const now = new Date();
    return {
      id,
      name: name.trim(),
      price: Math.round(price * 100) / 100,
      category,
      description: description.trim(),
      inStock,
      createdAt: now,
      updatedAt: now
    };
  }
  
  public static updateProduct(existingProduct: Product, updates: UpdateProductRequest): Product {
    const now = new Date();
    
    const updatedProduct = {
      ...existingProduct,
      ...updates,
      updatedAt: now
    };
    
    // Validate updated product
    this.validateProduct(
      updatedProduct.name,
      updatedProduct.price,
      updatedProduct.description
    );
    
    return updatedProduct;
  }
  
  private static validateProduct(name: string, price: number, description: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Product name must be at least 2 characters long');
    }
    
    if (price <= 0) {
      throw new Error('Product price must be positive');
    }
    
    if (!description || description.trim().length < 10) {
      throw new Error('Product description must be at least 10 characters long');
    }
  }
}
