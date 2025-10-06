import api from './apiClient'

// Products API functions
export const productsAPI = {
  // Get all products
  getAll: async (filters = {}) => {
    try {
      console.log('Products API - Getting all products with filters:', filters)
      const response = await api.get('/products', { params: filters })
      console.log('Products API - Products retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Products API - Get all products error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch products')
    }
  },

  // Get single product
  getById: async (id) => {
    try {
      console.log('Products API - Getting product by ID:', id)
      const response = await api.get(`/products/${id}`)
      console.log('Products API - Product retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Products API - Get product error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch product')
    }
  },

  // Create new product
  create: async (productData) => {
    try {
      console.log('Products API - Creating product:', productData)
      const response = await api.post('/products', productData)
      console.log('Products API - Product created:', response.data)
      return response.data
    } catch (error) {
      console.error('Products API - Create product error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to create product')
    }
  },

  // Update product
  update: async (id, productData) => {
    try {
      console.log('Products API - Updating product:', id, productData)
      const response = await api.patch(`/products/${id}`, productData)
      console.log('Products API - Product updated:', response.data)
      return response.data
    } catch (error) {
      console.error('Products API - Update product error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to update product')
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      console.log('Products API - Deleting product:', id)
      const response = await api.delete(`/products/${id}`)
      console.log('Products API - Product deleted:', response.data)
      return response.data
    } catch (error) {
      console.error('Products API - Delete product error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to delete product')
    }
  },

  // Get available colors for a product
  getAvailableColors: async (id) => {
    try {
      console.log('Products API - Getting available colors for product:', id)
      const response = await api.get(`/products/${id}/colors`)
      console.log('Products API - Colors retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Products API - Get colors error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch product colors')
    }
  },

  // Get images by color
  getImagesByColor: async (id, color) => {
    try {
      console.log('Products API - Getting images by color:', id, color)
      const response = await api.get(`/products/${id}/images/${color}`)
      console.log('Products API - Images retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('Products API - Get images by color error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to fetch product images')
    }
  },

  // Add image to product
  addImage: async (id, imageData) => {
    try {
      console.log('Products API - Adding image to product:', id, imageData)
      const response = await api.post(`/products/${id}/images`, imageData)
      console.log('Products API - Image added:', response.data)
      return response.data
    } catch (error) {
      console.error('Products API - Add image error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to add product image')
    }
  },

  // Add multiple images to product
  addMultipleImages: async (id, imagesData) => {
    try {
      console.log('Products API - Adding multiple images to product:', id, imagesData)
      const response = await api.post(`/products/${id}/images/multiple`, imagesData)
      console.log('Products API - Images added:', response.data)
      return response.data
    } catch (error) {
      console.error('Products API - Add multiple images error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to add product images')
    }
  },

  // Remove image from product
  removeImage: async (id, imageId) => {
    try {
      console.log('Products API - Removing image from product:', id, imageId)
      const response = await api.delete(`/products/${id}/images/${imageId}`)
      console.log('Products API - Image removed:', response.data)
      return response.data
    } catch (error) {
      console.error('Products API - Remove image error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to remove product image')
    }
  },

  // Add variant to product
  addVariant: async (id, variantData) => {
    try {
      console.log('Products API - Adding variant to product:', id, variantData)
      const response = await api.post(`/products/${id}/variants`, variantData)
      console.log('Products API - Variant added:', response.data)
      return response.data
    } catch (error) {
      console.error('Products API - Add variant error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to add product variant')
    }
  },

  // Remove variant from product
  removeVariant: async (id, variantId) => {
    try {
      console.log('Products API - Removing variant from product:', id, variantId)
      const response = await api.delete(`/products/${id}/variants/${variantId}`)
      console.log('Products API - Variant removed:', response.data)
      return response.data
    } catch (error) {
      console.error('Products API - Remove variant error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to remove product variant')
    }
  }
}
