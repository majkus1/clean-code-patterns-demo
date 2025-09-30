import React, { useState } from 'react';
import { useProducts, useSearchProducts } from '../hooks/useProducts';
import { Product, ProductCategory } from '../types/api';
import { ProductForm } from './ProductForm';
import { ProductCard } from './ProductCard';

export const ProductList: React.FC = () => {
  const {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
    isDeleting
  } = useProducts();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  const { data: searchResults } = useSearchProducts(searchQuery);

  const handleCreateProduct = async (productData: {
    name: string;
    price: number;
    category: ProductCategory;
    description: string;
    inStock?: boolean;
  }) => {
    try {
      await new Promise<void>((resolve, reject) => {
        createProduct(productData, {
          onSuccess: () => {
            setShowForm(false);
            resolve();
          },
          onError: reject
        });
      });
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const handleUpdateProduct = async (id: string, updates: {
    name?: string;
    price?: number;
    category?: ProductCategory;
    description?: string;
    inStock?: boolean;
  }) => {
    try {
      await new Promise<void>((resolve, reject) => {
        updateProduct({ id, updates }, {
          onSuccess: () => {
            setEditingProduct(null);
            resolve();
          },
          onError: reject
        });
      });
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await new Promise<void>((resolve, reject) => {
          deleteProduct(id, {
            onSuccess: () => resolve(),
            onError: reject
          });
        });
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const getFilteredProducts = (): Product[] => {
    let filteredProducts = products;

    if (searchQuery) {
      filteredProducts = searchResults || [];
    }

    if (selectedCategory !== 'all') {
      filteredProducts = filteredProducts.filter(
        product => product.category === selectedCategory
      );
    }

    return filteredProducts;
  };

  const categoryLabels: Record<ProductCategory, string> = {
    [ProductCategory.ELECTRONICS]: 'Electronics',
    [ProductCategory.CLOTHING]: 'Clothing',
    [ProductCategory.BOOKS]: 'Books',
    [ProductCategory.HOME]: 'Home',
    [ProductCategory.SPORTS]: 'Sports'
  };

  if (isLoading) {
    return (
      <div className="loading">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Error loading products: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>Products List</h2>
        <button 
          onClick={() => setShowForm(true)}
          disabled={isCreating}
          className="btn btn-primary"
        >
          {isCreating ? 'Tworzenie...' : 'Dodaj Produkt'}
        </button>
      </div>

      <div className="product-filters">
        <div className="filter-group">
          <label htmlFor="search">Wyszukaj:</label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nazwa lub opis produktu..."
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category">Kategoria:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | 'all')}
            className="category-select"
          >
            <option value="all">Wszystkie kategorie</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setShowForm(false)}
          isSubmitting={isCreating}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={(updates) => handleUpdateProduct(editingProduct.id, updates)}
          onCancel={() => setEditingProduct(null)}
          isSubmitting={isUpdating}
        />
      )}

      <div className="product-grid">
        {getFilteredProducts().length === 0 ? (
          <p className="empty-state">
            {searchQuery || selectedCategory !== 'all' 
              ? 'No products matching search criteria' 
              : 'No products to display'
            }
          </p>
        ) : (
          getFilteredProducts().map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => setEditingProduct(product)}
              onDelete={() => handleDeleteProduct(product.id)}
              isDeleting={isDeleting}
            />
          ))
        )}
      </div>
    </div>
  );
};
