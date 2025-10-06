import api from './apiClient'

// Cart API functions
export const cartAPI = {
  // Get user's cart
  getCart: async () => {
    try {
      console.log('Cart API - Getting cart')
      const response = await api.get('/cart')
      
      console.log('Cart API - Cart retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Cart API - Get cart error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to get cart')
    }
  },

  // Add item to cart
  addItem: async (cartItemData) => {
    try {
      console.log('Cart API - Adding item to cart:', cartItemData)
      const response = await api.post('/cart/items', cartItemData)
      
      console.log('Cart API - Item added to cart:', response.data)
      return response.data
    } catch (error) {
      console.error('Cart API - Add item error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to add item to cart')
    }
  },

  // Update cart item quantity
  updateItem: async (itemId, updateData) => {
    try {
      console.log('Cart API - Updating cart item:', itemId, updateData)
      const response = await api.put(`/cart/items/${itemId}`, updateData)
      
      console.log('Cart API - Cart item updated:', response.data)
      return response.data
    } catch (error) {
      console.error('Cart API - Update item error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to update cart item')
    }
  },

  // Remove item from cart
  removeItem: async (itemId) => {
    try {
      console.log('Cart API - Removing cart item:', itemId)
      const response = await api.delete(`/cart/items/${itemId}`)
      
      console.log('Cart API - Cart item removed:', response.data)
      return response.data
    } catch (error) {
      console.error('Cart API - Remove item error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to remove cart item')
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      console.log('Cart API - Clearing cart')
      const response = await api.delete('/cart')
      
      console.log('Cart API - Cart cleared:', response.data)
      return response.data
    } catch (error) {
      console.error('Cart API - Clear cart error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to clear cart')
    }
  },

  // Get cart summary
  getCartSummary: async () => {
    try {
      console.log('Cart API - Getting cart summary')
      const response = await api.get('/cart/summary')
      
      console.log('Cart API - Cart summary retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Cart API - Get summary error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to get cart summary')
    }
  }
}
