import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsAPI } from '../services/api'

// Query keys for consistent caching
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), { filters }],
  details: () => [...productKeys.all, 'detail'],
  detail: (id) => [...productKeys.details(), id],
  categories: () => [...productKeys.all, 'categories'],
  collections: () => [...productKeys.all, 'collections'],
}

// Custom hook for fetching products with caching
export function useProducts(filters = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsAPI.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Custom hook for fetching a single product
export function useProduct(productId) {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productsAPI.getById(productId),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes for individual products
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Custom hook for fetching products by category
export function useProductsByCategory(categoryName, filters = {}) {
  return useQuery({
    queryKey: productKeys.list({ category: categoryName, ...filters }),
    queryFn: () => productsAPI.getByCategory(categoryName, filters),
    enabled: !!categoryName,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Custom hook for fetching products by collection
export function useProductsByCollection(collectionName, filters = {}) {
  return useQuery({
    queryKey: productKeys.list({ collection: collectionName, ...filters }),
    queryFn: () => productsAPI.getByCollection(collectionName, filters),
    enabled: !!collectionName,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Custom hook for fetching products by subcategory
export function useProductsBySubcategory(subcategoryId, filters = {}) {
  return useQuery({
    queryKey: productKeys.list({ subcategory: subcategoryId, ...filters }),
    queryFn: () => productsAPI.getBySubcategory(subcategoryId, filters),
    enabled: !!subcategoryId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Custom hook for fetching featured products
export function useFeaturedProducts(filters = {}) {
  return useQuery({
    queryKey: productKeys.list({ isFeatured: true, ...filters }),
    queryFn: () => productsAPI.getAll({ isFeatured: true, ...filters }),
    staleTime: 10 * 60 * 1000, // 10 minutes - featured products change less frequently
    gcTime: 20 * 60 * 1000, // 20 minutes
  })
}

// Custom hook for fetching products on sale
export function useSaleProducts(filters = {}) {
  return useQuery({
    queryKey: productKeys.list({ isOnSale: true, ...filters }),
    queryFn: () => productsAPI.getAll({ isOnSale: true, ...filters }),
    staleTime: 5 * 60 * 1000, // 5 minutes - sales change more frequently
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Custom hook for creating a product
export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: productsAPI.create,
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

// Custom hook for updating a product
export function useUpdateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => productsAPI.update(id, data),
    onSuccess: (data, variables) => {
      // Update the specific product in cache
      queryClient.setQueryData(productKeys.detail(variables.id), data)
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

// Custom hook for deleting a product
export function useDeleteProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: productsAPI.delete,
    onSuccess: () => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}