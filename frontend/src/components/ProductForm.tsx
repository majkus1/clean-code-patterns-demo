import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../types/api';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: {
    name: string;
    price: number;
    category: ProductCategory;
    description: string;
    inStock?: boolean;
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.ELECTRONICS]: 'Elektronika',
  [ProductCategory.CLOTHING]: 'Odzież',
  [ProductCategory.BOOKS]: 'Książki',
  [ProductCategory.HOME]: 'Dom',
  [ProductCategory.SPORTS]: 'Sport'
};

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    category: product?.category || ProductCategory.ELECTRONICS,
    description: product?.description || '',
    inStock: product?.inStock ?? true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        inStock: product.inStock
      });
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Nazwa jest wymagana';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nazwa musi mieć co najmniej 2 znaki';
    }

    // Price validation
    if (formData.price <= 0) {
      newErrors.price = 'Cena musi być większa od 0';
    }

    // Description validation
    if (!formData.description) {
      newErrors.description = 'Opis jest wymagany';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Opis musi mieć co najmniej 10 znaków';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        price: Number(formData.price),
        category: formData.category,
        description: formData.description.trim(),
        inStock: formData.inStock
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form">
        <h3>{product ? 'Edytuj Produkt' : 'Dodaj Nowy Produkt'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nazwa:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Cena (PLN):</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={errors.price ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Kategoria:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Opis:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={errors.description ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              Dostępny w magazynie
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="btn btn-secondary"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Zapisywanie...' : (product ? 'Zaktualizuj' : 'Utwórz')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
