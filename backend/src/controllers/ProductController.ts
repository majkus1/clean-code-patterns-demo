import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { CreateProductRequest, UpdateProductRequest, ProductCategory } from '../models/Product';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class ProductController {
  constructor(private readonly productService: ProductService) {}
  
  public createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const productData: CreateProductRequest = req.body;
    
    logger.info('Product creation request received', { name: productData.name });
    
    const product = await this.productService.createProduct(productData);
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  });
  
  public getProductById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
      return;
    }
    
    const product = await this.productService.getProductById(id);
    
    res.status(200).json({
      success: true,
      data: product
    });
  });
  
  public getAllProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const products = await this.productService.getAllProducts();
    
    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  });
  
  public getProductsByCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { category } = req.params;
    
    if (!Object.values(ProductCategory).includes(category as ProductCategory)) {
      res.status(400).json({
        success: false,
        message: 'Invalid product category'
      });
      return;
    }
    
    const products = await this.productService.getProductsByCategory(category as ProductCategory);
    
    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  });
  
  public getInStockProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const products = await this.productService.getInStockProducts();
    
    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  });
  
  public searchProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Search query parameter is required'
      });
      return;
    }
    
    const products = await this.productService.searchProducts(q);
    
    res.status(200).json({
      success: true,
      data: products,
      count: products.length,
      query: q
    });
  });
  
  public updateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updates: UpdateProductRequest = req.body;
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
      return;
    }
    
    logger.info('Product update request received', { productId: id });
    
    const product = await this.productService.updateProduct(id, updates);
    
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  });
  
  public deleteProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
      return;
    }
    
    logger.info('Product deletion request received', { productId: id });
    
    await this.productService.deleteProduct(id);
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  });
}
