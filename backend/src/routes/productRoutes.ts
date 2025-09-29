import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../services/ProductService';
import { InMemoryProductRepository } from '../repositories/InMemoryProductRepository';
import { SimpleEventPublisher } from '../events/SimpleEventPublisher';

// Dependency Injection
const productRepository = new InMemoryProductRepository();
const eventPublisher = new SimpleEventPublisher();
const productService = new ProductService(productRepository, eventPublisher);
const productController = new ProductController(productService);

const router = Router();

// Routes
router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/in-stock', productController.getInStockProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export { router as productRoutes };
