import React from 'react';
import { Product, ProductCategory } from '../types/api';

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.ELECTRONICS]: 'Electronics',
  [ProductCategory.CLOTHING]: 'Clothing',
  [ProductCategory.BOOKS]: 'Books',
  [ProductCategory.HOME]: 'Home',
  [ProductCategory.SPORTS]: 'Sports'
};

const categoryEmojis: Record<ProductCategory, string> = {
  [ProductCategory.ELECTRONICS]: '📱',
  [ProductCategory.CLOTHING]: '👕',
  [ProductCategory.BOOKS]: '📚',
  [ProductCategory.HOME]: '🏠',
  [ProductCategory.SPORTS]: '⚽'
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  isDeleting
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(price);
  };

  return (
    <div className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}>
      <div className="product-card-header">
        <div className="product-title">
          <span className="category-emoji">
            {categoryEmojis[product.category]}
          </span>
          <h3>{product.name}</h3>
        </div>
        <div className="product-card-actions">
          <button
            onClick={onEdit}
            className="btn btn-small btn-secondary"
            title="Edytuj produkt"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="btn btn-small btn-danger"
            title="Delete product"
          >
            {isDeleting ? '⏳' : '🗑️'}
          </button>
        </div>
      </div>
      
      <div className="product-card-content">
        <div className="product-price">
          <span className="price-label">Cena:</span>
          <span className="price-value">{formatPrice(product.price)}</span>
        </div>

        <div className="product-category">
          <span className="category-label">Kategoria:</span>
          <span className="category-value">
            {categoryLabels[product.category]}
          </span>
        </div>

        <div className="product-status">
          <span className={`status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {product.inStock ? '✅ Available' : '❌ Out of Stock'}
          </span>
        </div>

        <div className="product-description">
          <p>{product.description}</p>
        </div>
        
        <div className="product-dates">
          <p className="product-date">
            <strong>Utworzony:</strong> {formatDate(product.createdAt)}
          </p>
          {product.updatedAt !== product.createdAt && (
            <p className="product-date">
              <strong>Zaktualizowany:</strong> {formatDate(product.updatedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
