import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../services/ApiService';
import { Product, CreateProductRequest, UpdateProductRequest, ProductCategory } from '../types/api';

const apiService = new ApiService();

export const useProducts = () => {
  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    error,
    refetch
  } = useQuery<Product[], Error>(
    'products',
    () => apiService.getAllProducts(),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );

  const createProductMutation = useMutation<Product, Error, CreateProductRequest>(
    (productData) => apiService.createProduct(productData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
      },
    }
  );

  const updateProductMutation = useMutation<
    Product,
    Error,
    { id: string; updates: UpdateProductRequest }
  >(
    ({ id, updates }) => apiService.updateProduct(id, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
      },
    }
  );

  const deleteProductMutation = useMutation<void, Error, string>(
    (id) => apiService.deleteProduct(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
      },
    }
  );

  return {
    products: products || [],
    isLoading,
    error,
    refetch,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    isCreating: createProductMutation.isLoading,
    isUpdating: updateProductMutation.isLoading,
    isDeleting: deleteProductMutation.isLoading,
    createError: createProductMutation.error,
    updateError: updateProductMutation.error,
    deleteError: deleteProductMutation.error,
  };
};

export const useProduct = (id: string) => {
  return useQuery<Product, Error>(
    ['product', id],
    () => apiService.getProductById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useProductsByCategory = (category: ProductCategory) => {
  return useQuery<Product[], Error>(
    ['productsByCategory', category],
    () => apiService.getProductsByCategory(category),
    {
      enabled: !!category,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useInStockProducts = () => {
  return useQuery<Product[], Error>(
    'inStockProducts',
    () => apiService.getInStockProducts(),
    {
      staleTime: 2 * 60 * 1000, // Shorter cache for stock status
    }
  );
};

export const useSearchProducts = (query: string) => {
  return useQuery<Product[], Error>(
    ['searchProducts', query],
    () => apiService.searchProducts(query),
    {
      enabled: !!query && query.length > 2,
      staleTime: 1 * 60 * 1000, // Very short cache for search results
    }
  );
};
