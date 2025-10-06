import api from './apiClient'

// Favorites API functions
export const favoritesAPI = {
  // Get user's favorites
  getFavorites: async () => {
    try {
      console.log('Favorites API - Getting favorites')
      const response = await api.get('/favorites')
      
      console.log('Favorites API - Favorites retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Favorites API - Get favorites error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to get favorites')
    }
  },

  // Add product to favorites
  addToFavorites: async (productId) => {
    try {
      console.log('Favorites API - Adding product to favorites:', productId)
      const response = await api.post('/favorites', { productId })
      
      console.log('Favorites API - Product added to favorites:', response.data)
      return response.data
    } catch (error) {
      console.error('Favorites API - Add to favorites error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to add to favorites')
    }
  },

  // Remove product from favorites
  removeFromFavorites: async (productId) => {
    try {
      console.log('Favorites API - Removing product from favorites:', productId)
      const response = await api.delete(`/favorites/${productId}`)
      
      console.log('Favorites API - Product removed from favorites:', response.data)
      return response.data
    } catch (error) {
      console.error('Favorites API - Remove from favorites error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to remove from favorites')
    }
  },

  // Check if product is in favorites
  isFavorite: async (productId) => {
    try {
      console.log('Favorites API - Checking if product is favorite:', productId)
      const response = await api.get(`/favorites/${productId}`)
      
      console.log('Favorites API - Favorite status checked:', response.data)
      return response.data
    } catch (error) {
      console.error('Favorites API - Check favorite error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to check favorite status')
    }
  },

  // Toggle favorite status
  toggleFavorite: async (productId) => {
    try {
      console.log('Favorites API - Toggling favorite status:', productId)
      const response = await api.post(`/favorites/${productId}/toggle`)
      
      console.log('Favorites API - Favorite status toggled:', response.data)
      return response.data
    } catch (error) {
      console.error('Favorites API - Toggle favorite error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to toggle favorite status')
    }
  }
}
