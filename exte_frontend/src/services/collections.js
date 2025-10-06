import api from './apiClient'

// Collections API functions
export const collectionsAPI = {
  // Get all collections
  getAll: async () => {
    try {
      console.log('Collections API - Getting all collections')
      const response = await api.get('/collections')
      console.log('Collections API - Collections retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Collections API - Get all collections error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch collections')
    }
  },

  // Get single collection
  getById: async (id) => {
    try {
      console.log('Collections API - Getting collection by ID:', id)
      const response = await api.get(`/collections/${id}`)
      console.log('Collections API - Collection retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Collections API - Get collection error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch collection')
    }
  },

  // Create new collection
  create: async (collectionData) => {
    try {
      console.log('Collections API - Creating collection:', collectionData)
      const response = await api.post('/collections', collectionData)
      console.log('Collections API - Collection created:', response.data)
      return response.data
    } catch (error) {
      console.error('Collections API - Create collection error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to create collection')
    }
  },

  // Update collection
  update: async (id, collectionData) => {
    try {
      console.log('Collections API - Updating collection:', id, collectionData)
      const response = await api.patch(`/collections/${id}`, collectionData)
      console.log('Collections API - Collection updated:', response.data)
      return response.data
    } catch (error) {
      console.error('Collections API - Update collection error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to update collection')
    }
  },

  // Delete collection
  delete: async (id) => {
    try {
      console.log('Collections API - Deleting collection:', id)
      const response = await api.delete(`/collections/${id}`)
      console.log('Collections API - Collection deleted:', response.data)
      return response.data
    } catch (error) {
      console.error('Collections API - Delete collection error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to delete collection')
    }
  }
}
