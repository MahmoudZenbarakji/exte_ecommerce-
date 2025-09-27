import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesAPI } from '../services/api'

// Query keys for categories
export const categoryKeys = {
  all: ['categories'],
  lists: () => [...categoryKeys.all, 'list'],
  list: (filters) => [...categoryKeys.lists(), { filters }],
  details: () => [...categoryKeys.all, 'detail'],
  detail: (id) => [...categoryKeys.details(), id],
  subcategories: (categoryId) => [...categoryKeys.all, 'subcategories', categoryId],
}

// Custom hook for fetching all categories
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: categoriesAPI.getAll,
    staleTime: 15 * 60 * 1000, // 15 minutes - categories change less frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Custom hook for fetching a single category
export function useCategory(categoryId) {
  return useQuery({
    queryKey: categoryKeys.detail(categoryId),
    queryFn: () => categoriesAPI.getById(categoryId),
    enabled: !!categoryId,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

// Custom hook for fetching subcategories
export function useSubcategories(categoryId) {
  return useQuery({
    queryKey: categoryKeys.subcategories(categoryId),
    queryFn: () => categoriesAPI.getSubcategories(categoryId),
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  })
}

// Custom hook for creating a category
export function useCreateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: categoriesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

// Custom hook for updating a category
export function useUpdateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => categoriesAPI.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(categoryKeys.detail(variables.id), data)
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

// Custom hook for deleting a category
export function useDeleteCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: categoriesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}