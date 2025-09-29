import { v4 as uuidv4 } from 'uuid';
import { Product, ProductCategory } from '../models/Product';
import { IRepository } from './IRepository';

/**
 * Repository Pattern - Product Implementation
 */
export class InMemoryProductRepository implements IRepository<Product, string> {
  private products: Map<string, Product> = new Map();
  
  public async findById(id: string): Promise<Product | null> {
    const product = this.products.get(id);
    return product || null;
  }
  
  public async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  public async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const id = uuidv4();
    const now = new Date();
    
    const product: Product = {
      ...productData,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.products.set(id, product);
    return product;
  }
  
  public async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const existingProduct = await this.findById(id);
    if (!existingProduct) {
      return null;
    }
    
    const updatedProduct: Product = {
      ...existingProduct,
      ...updates,
      updatedAt: new Date()
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  public async delete(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
  
  public async exists(id: string): Promise<boolean> {
    return this.products.has(id);
  }
  
  public async findByCategory(category: ProductCategory): Promise<Product[]> {
    const products = Array.from(this.products.values());
    return products.filter(p => p.category === category);
  }
  
  public async findInStock(): Promise<Product[]> {
    const products = Array.from(this.products.values());
    return products.filter(p => p.inStock);
  }
  
  public async clear(): Promise<void> {
    this.products.clear();
  }
}
