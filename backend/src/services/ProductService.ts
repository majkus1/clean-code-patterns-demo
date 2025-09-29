import { Product, CreateProductRequest, UpdateProductRequest, ProductCategory, ProductFactory } from '../models/Product';
import { InMemoryProductRepository } from '../repositories/InMemoryProductRepository';
import { logger } from '../utils/logger';
import { IEventPublisher } from '../events/IEventPublisher';

/**
 * Service Layer Pattern dla produktów
 */
export class ProductService {
  constructor(
    private readonly productRepository: InMemoryProductRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}
  
  public async createProduct(request: CreateProductRequest): Promise<Product> {
    logger.info('Creating new product', { name: request.name });
    
    const product = await this.productRepository.create({
      name: request.name,
      price: request.price,
      category: request.category,
      description: request.description,
      inStock: request.inStock ?? true
    });
    
    logger.info('Product created successfully', { productId: product.id });
    return product;
  }
  
  public async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  }
  
  public async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
  
  public async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    return await this.productRepository.findByCategory(category);
  }
  
  public async getInStockProducts(): Promise<Product[]> {
    return await this.productRepository.findInStock();
  }
  
  public async updateProduct(id: string, updates: UpdateProductRequest): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);
    
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    
    const updatedProduct = ProductFactory.updateProduct(existingProduct, updates);
    const savedProduct = await this.productRepository.update(id, updatedProduct);
    
    if (!savedProduct) {
      throw new Error('Failed to update product');
    }
    
    logger.info('Product updated successfully', { productId: id });
    return savedProduct;
  }
  
  public async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete product');
    }
    
    logger.info('Product deleted successfully', { productId: id });
  }
  
  public async searchProducts(query: string): Promise<Product[]> {
    const allProducts = await this.productRepository.findAll();
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}
