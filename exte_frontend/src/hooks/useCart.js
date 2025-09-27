import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartAPI } from '../services/api'

// Query keys for cart
export const cartKeys = {
  all: ['cart'],
  items: () => [...cartKeys.all, 'items'],
  count: () => [...cartKeys.all, 'count'],
}

// Custom hook for fetching cart items
export function useCartItems() {
  return useQuery({
    queryKey: cartKeys.items(),
    queryFn: cartAPI.getCart,
    staleTime: 2 * 60 * 1000, // 2 minutes - cart changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Custom hook for fetching cart count
export function useCartCount() {
  return useQuery({
    queryKey: cartKeys.count(),
    queryFn: cartAPI.getCartCount,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
  })
}

// Custom hook for adding item to cart
export function useAddToCart() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: cartAPI.addItem,
    onSuccess: () => {
      // Invalidate both cart items and count
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
      queryClient.invalidateQueries({ queryKey: cartKeys.count() })
    },
  })
}

// Custom hook for updating cart item quantity
export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ itemId, data }) => cartAPI.updateItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
      queryClient.invalidateQueries({ queryKey: cartKeys.count() })
    },
  })
}

// Custom hook for removing item from cart
export function useRemoveFromCart() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: cartAPI.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
      queryClient.invalidateQueries({ queryKey: cartKeys.count() })
    },
  })
}

// Custom hook for clearing cart
export function useClearCart() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: cartAPI.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
      queryClient.invalidateQueries({ queryKey: cartKeys.count() })
    },
  })
}
