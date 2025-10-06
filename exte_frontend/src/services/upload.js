import api from './apiClient'

// Upload API functions
export const uploadAPI = {
  // Upload category image
  uploadCategoryImage: async (file) => {
    try {
      console.log('🚀 Starting category image upload for file:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB')
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/upload/category-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('✅ Category image upload successful:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Category image upload failed:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to upload image')
    }
  },

  // Upload product image
  uploadProductImage: async (file) => {
    try {
      console.log('🚀 Starting product image upload for file:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB')
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/upload/product-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('✅ Product image upload successful:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Product image upload failed:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to upload image')
    }
  },

  // Upload multiple files (general purpose)
  uploadMultipleFiles: async (files, folder = 'products') => {
    try {
      console.log('📤 API: Starting multiple file upload for', files.length, 'files, folder:', folder)
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })
      formData.append('folder', folder)
      
      const response = await api.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('📥 API: Multiple file upload completed successfully')
      return response.data.urls // Return just the URLs array
    } catch (error) {
      console.error('❌ API: Multiple file upload failed:', error)
      throw new Error(error.response?.data?.message || 'Failed to upload files')
    }
  },

  // Upload multiple product images with color
  uploadMultipleProductImages: async (files, color, productId) => {
    try {
      console.log('📤 API: Starting multiple upload for', files.length, 'files, color:', color, 'productId:', productId)
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })
      if (color) formData.append('color', color)
      if (productId) formData.append('productId', productId)
      
      const response = await api.post('/upload/product-images-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('📥 API: Multiple upload completed successfully')
      return response.data
    } catch (error) {
      console.error('❌ API: Multiple upload failed:', error)
      throw new Error(error.response?.data?.message || 'Failed to upload images')
    }
  },

  // Upload collection image
  uploadCollectionImage: async (file) => {
    try {
      console.log('🚀 Starting collection image upload for file:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB')
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/upload/collection-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('✅ Collection image upload successful:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Collection image upload failed:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Failed to upload image')
    }
  }
}
