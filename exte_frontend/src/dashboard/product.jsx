import { useState, useEffect } from 'react'
import { Plus as PlusIcon, Pencil as PencilIcon, Trash2 as TrashIcon, Image as PhotoIcon } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import  {Textarea} from './components/ui/textarea'
import { Label } from './components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { productsAPI, categoriesAPI, collectionsAPI, subcategoriesAPI, uploadAPI } from '../services/api'
import { validateImage } from '../utils/imageCompression.js'
import ProductColorImageManager from './components/ProductColorImageManager'
import AdminGuide from './components/AdminGuide'

// Utility function to get full image URL
const getImageUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `http://localhost:3000${url}`
}

  import {Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,} from './components/ui/dialog'



export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [collections, setCollections] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [imageRemoved, setImageRemoved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProductForManagement, setSelectedProductForManagement] = useState(null)
  const [activeTab, setActiveTab] = useState('products')
  const [fileProcessing, setFileProcessing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState('')
  
  // Available colors and sizes
  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Gray', 'Pink', 'Purple', 'Orange']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    sku: '',
    categoryId: '',
    subcategoryId: '',
    collectionId: '',
    isActive: true,
    isFeatured: false,
    isOnSale: false,
    salePrice: 0,
    saleBadge: '',
    images: [],
    variants: [],
    selectedColors: [],
    selectedSizes: []
  })

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview)
        }
      })
    }
  }, [imagePreviews])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData, collectionsData] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
        collectionsAPI.getAll()
      ])
      
      setProducts(productsData)
      setCategories(categoriesData)
      // Filter only active collections
      const activeCollections = collectionsData.filter(collection => collection.isActive)
      setCollections(activeCollections)
    } catch (err) {
      setError(err.message || 'Failed to fetch data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([])
      return
    }
    
    try {
      const subcategoriesData = await subcategoriesAPI.getByCategory(categoryId)
      setSubcategories(subcategoriesData)
    } catch (err) {
      console.error('Error fetching subcategories:', err)
      setSubcategories([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Prevent multiple submissions
    if (isSubmitting || uploading) {
      console.log('Form submission already in progress, ignoring...')
      return
    }
    
    setIsSubmitting(true)
    try {
      let productData = { ...formData }
      
      // Convert price and stock to numbers
      productData.price = parseFloat(formData.price)
      productData.stock = parseInt(formData.stock)
      
      // Handle sale fields
      productData.isOnSale = formData.isOnSale
      if (formData.isOnSale && formData.salePrice) {
        productData.salePrice = parseFloat(formData.salePrice)
      } else {
        productData.salePrice = null
      }
      if (formData.isOnSale && formData.saleBadge) {
        productData.saleBadge = formData.saleBadge
      } else {
        productData.saleBadge = null
      }
      
      // Handle multiple image upload/update
      if (selectedFiles && selectedFiles.length > 0) {
        console.log('🖼️ Uploading multiple product images...', selectedFiles.length, 'files')
        setUploading(true)
        
        // Upload multiple images
        const imageUrls = await uploadAPI.uploadMultipleFiles(selectedFiles, 'products')
        
        if (!imageUrls || imageUrls.length === 0) {
          throw new Error('Failed to upload images')
        }
        
        console.log('✅ Product images uploaded successfully, URLs:', imageUrls)
        productData.images = imageUrls.map((url, index) => ({ 
          url, 
          isMain: index === 0,
          order: index 
        }))
        setUploading(false)
      } else if (editingProduct) {
        // When editing without new images, check if images were explicitly removed
        if (imageRemoved) {
          console.log('Images were removed, setting to empty array')
          productData.images = []
        } else if (editingProduct.images && editingProduct.images.length > 0) {
          // Keep existing images if no new files are selected and not removed
          productData.images = editingProduct.images
        } else {
          // If no existing images and no new files, remove images
          productData.images = []
        }
      } else {
        // No images provided for new product - remove the images field entirely
        delete productData.images
      }
      
      // Create variants from selected colors and sizes
      if (formData.selectedColors.length > 0 && formData.selectedSizes.length > 0) {
        productData.variants = []
        formData.selectedColors.forEach(color => {
          formData.selectedSizes.forEach(size => {
            const variant = {
              color: color,
              size: size,
              stock: productData.stock,
              price: productData.price
            }
            // Only add SKU if it exists
            if (productData.sku) {
              variant.sku = `${productData.sku}-${color.toUpperCase()}-${size}`
            }
            productData.variants.push(variant)
          })
        })
      }
      
      // Remove temporary fields
      delete productData.selectedColors
      delete productData.selectedSizes
      
      // Remove empty optional fields
      if (!productData.subcategoryId) delete productData.subcategoryId
      if (!productData.collectionId) delete productData.collectionId
      if (!productData.images || productData.images.length === 0) delete productData.images
      if (!productData.variants || productData.variants.length === 0) delete productData.variants
      
      console.log('Sending product data:', productData)
      
      if (editingProduct) {
        // Update existing product
        console.log('🔄 Updating product:', editingProduct.id, 'with data:', productData)
        const result = await productsAPI.update(editingProduct.id, productData)
        console.log('✅ Product updated successfully:', result)
      } else {
        // Add new product
        console.log('🆕 Creating new product with data:', productData)
        const result = await productsAPI.create(productData)
        console.log('✅ Product created successfully:', result)
      }
      
      // Refresh products list
      await fetchData()
      setIsDialogOpen(false)
      resetForm()
    } catch (err) {
      setError(err.message || 'Failed to save product')
      console.error('Error saving product:', err)
    } finally {
      setIsSubmitting(false)
      setUploading(false) // Ensure uploading state is cleared on error
    }
  }


  const processFiles = async (files) => {
    // Prevent multiple file processing
    if (fileProcessing) {
      console.log('File processing already in progress, ignoring...')
      return
    }
    
    if (files.length > 0) {
      // Validate all images
      const invalidFiles = []
      files.forEach(file => {
        const validation = validateImage(file)
        if (!validation.valid) {
          invalidFiles.push(`${file.name}: ${validation.error}`)
        }
      })

      if (invalidFiles.length > 0) {
        alert(`Invalid files:\n${invalidFiles.join('\n')}`)
        return
      }

      try {
        setFileProcessing(true)
        console.log('Processing', files.length, 'image files:', files.map(f => f.name))
        
        // Set selected files
        setSelectedFiles(files)
        setImageRemoved(false) // Reset removal flag when new files are selected
        
        // Create preview URLs for all files
        const previewUrls = files.map(file => URL.createObjectURL(file))
        setImagePreviews(previewUrls)
        
        console.log('Images ready for upload:', files.map(f => f.name))
      } catch (error) {
        console.error('Error processing images:', error)
        alert('Error processing images. Please try again.')
      } finally {
        setFileProcessing(false)
      }
    } else {
      // If no files selected, reset to original images (if editing and not removed)
      if (editingProduct && editingProduct.images && editingProduct.images.length > 0 && !imageRemoved) {
        const previewUrls = editingProduct.images.map(img => img.url)
        setImagePreviews(previewUrls)
      } else {
        setImagePreviews([])
      }
      setSelectedFiles([])
    }
  }

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files)
    await processFiles(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      await processFiles(files)
    }
  }

  const handleColorChange = (color) => {
    const newColors = formData.selectedColors.includes(color)
      ? formData.selectedColors.filter(c => c !== color)
      : [...formData.selectedColors, color]
    setFormData({...formData, selectedColors: newColors})
  }

  const handleSizeChange = (size) => {
    const newSizes = formData.selectedSizes.includes(size)
      ? formData.selectedSizes.filter(s => s !== size)
      : [...formData.selectedSizes, size]
    setFormData({...formData, selectedSizes: newSizes})
  }

  const handleCategoryChange = (categoryId) => {
    setFormData({...formData, categoryId, subcategoryId: ''}) // Reset subcategory when category changes
    fetchSubcategories(categoryId)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    
    // Extract colors and sizes from variants
    const selectedColors = product.variants ? [...new Set(product.variants.map(v => v.color))] : []
    const selectedSizes = product.variants ? [...new Set(product.variants.map(v => v.size))] : []
    
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      sku: product.sku || '',
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId || '',
      collectionId: product.collectionId || '',
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale || false,
      salePrice: product.salePrice ? product.salePrice.toString() : '0',
      saleBadge: product.saleBadge || '',
      images: product.images || [],
      variants: product.variants || [],
      selectedColors: selectedColors,
      selectedSizes: selectedSizes
    })
    
    // Fetch subcategories for the selected category
    if (product.categoryId) {
      fetchSubcategories(product.categoryId)
    }
    
    // Set image previews to existing images if available
    if (product.images && product.images.length > 0) {
      const previewUrls = product.images.map(img => img.url)
      setImagePreviews(previewUrls)
    } else {
      setImagePreviews([])
    }
    
    setSelectedFiles([]) // Clear any previously selected files
    setImageRemoved(false) // Reset removal flag
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id)
        await fetchData() // Refresh the list
      } catch (err) {
        setError(err.message || 'Failed to delete product')
        console.error('Error deleting product:', err)
      }
    }
  }


  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      sku: '',
      categoryId: '',
      subcategoryId: '',
      collectionId: '',
      isActive: true,
      isFeatured: false,
      isOnSale: false,
      salePrice: 0,
      saleBadge: '',
      images: [],
      variants: [],
      selectedColors: [],
      selectedSizes: []
    })
    setSelectedFiles([])
    setImageRemoved(false) // Reset removal flag
    setSubcategories([]) // Clear subcategories
    
    // Clean up object URLs if they exist
    imagePreviews.forEach(preview => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    })
    setImagePreviews([])
    
    // Clear any file input
    const fileInput = document.getElementById('image')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleManageProduct = async (product) => {
    try {
      // Fetch full product data with images and variants
      const fullProduct = await productsAPI.getById(product.id)
      setSelectedProductForManagement(fullProduct)
      // Switch to management tab
      setActiveTab('management')
    } catch (error) {
      console.error('Error fetching product details:', error)
      setError('Failed to load product details')
    }
  }

  const handleProductUpdate = async () => {
    if (selectedProductForManagement) {
      try {
        const updatedProduct = await productsAPI.getById(selectedProductForManagement.id)
        setSelectedProductForManagement(updatedProduct)
        await fetchData() // Refresh the main product list
      } catch (error) {
        console.error('Error updating product:', error)
      }
    }
  }

  const handleBackToProducts = () => {
    setActiveTab('products')
    setSelectedProductForManagement(null)
  }

  const openImageModal = (imageUrl) => {
    setSelectedImageUrl(imageUrl)
    setIsImageModalOpen(true)
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)
    setSelectedImageUrl('')
  }

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isImageModalOpen) {
        closeImageModal()
      }
    }

    if (isImageModalOpen) {
      document.addEventListener('keydown', handleEscKey)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isImageModalOpen])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading products...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  // Image Modal Component
  const ImageModal = () => {
    if (!isImageModalOpen || !selectedImageUrl) return null

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out"
        onClick={closeImageModal}
      >
        <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
          {/* Close Button */}
          <button
            onClick={closeImageModal}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black bg-opacity-50 rounded-full p-2"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Image Container */}
          <div 
            className="relative bg-white rounded-lg shadow-2xl overflow-hidden max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(selectedImageUrl)}
              alt="Product image"
              className="w-full h-auto max-h-[80vh] object-contain"
              onError={(e) => {
                e.target.src = '/placeholder-image.png'
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Product List</TabsTrigger>
          <TabsTrigger value="management" disabled={!selectedProductForManagement}>
            Color & Image Management
          </TabsTrigger>
          <TabsTrigger value="guide">Admin Guide</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="mt-2 text-sm text-gray-700">
                Manage your product inventory, pricing, and details.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct 
                    ? 'Update the product details below.'
                    : 'Create a new product for your store.'
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price (SYP)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sku">SKU (Optional)</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                        placeholder="Enter product SKU (optional)"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={formData.categoryId}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                      <select
                        id="subcategory"
                        value={formData.subcategoryId}
                        onChange={(e) => setFormData({...formData, subcategoryId: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!formData.categoryId || subcategories.length === 0}
                      >
                        <option value="">Select subcategory</option>
                        {subcategories.map(subcategory => (
                          <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                        ))}
                      </select>
                      {formData.categoryId && subcategories.length === 0 && (
                        <p className="text-xs text-gray-500">No subcategories available for this category</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="collection">Collection (Optional)</Label>
                      <select
                        id="collection"
                        value={formData.collectionId}
                        onChange={(e) => setFormData({...formData, collectionId: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select collection</option>
                        {collections.map(collection => (
                          <option key={collection.id} value={collection.id}>{collection.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="image">
                      {editingProduct ? 'Replace Product Images' : 'Product Images'}
                    </Label>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isDragOver 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                            Click to upload
                          </span>
                          {' '}or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Multiple images supported (up to 10 files). The first image will be the main product image.
                        </p>
                      </div>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>
                    {editingProduct && (
                      <p className="text-sm text-gray-600">
                        {imageRemoved ? 'Images removed (select new files to add them):' : 
                         imagePreviews.length > 0 ? `Current images (${imagePreviews.length}) (select new files to replace):` : 
                         'No current images (select files to add them):'}
                      </p>
                    )}
                    {imageRemoved && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-red-700">
                            ⚠️ Image will be removed when you save the product
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setImageRemoved(false)
                              if (editingProduct && editingProduct.images && editingProduct.images.length > 0) {
                                const previewUrls = editingProduct.images.map(img => img.url)
                                setImagePreviews(previewUrls)
                              }
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Restore
                          </Button>
                        </div>
                      </div>
                    )}
                    {imagePreviews.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {editingProduct ? 'Current Images:' : 'Preview:'}
                          </span>
                          {selectedFiles.length > 0 && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {selectedFiles.length} New Image{selectedFiles.length > 1 ? 's' : ''} Selected
                            </span>
                          )}
                          {editingProduct && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setImagePreviews([])
                                setSelectedFiles([])
                                setImageRemoved(true) // Mark images as removed
                                const fileInput = document.getElementById('image')
                                if (fileInput) fileInput.value = ''
                                console.log('Images removed by user')
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove All
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={getImageUrl(preview)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity duration-200"
                                onClick={() => openImageModal(preview)}
                                onError={(e) => {
                                  e.target.src = '/placeholder-image.png'; // Fallback image
                                }}
                              />
                              {index === 0 && (
                                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                                  Main
                                </div>
                              )}
                              {editingProduct && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newPreviews = imagePreviews.filter((_, i) => i !== index)
                                    setImagePreviews(newPreviews)
                                    if (newPreviews.length === 0) {
                                      setImageRemoved(true)
                                    }
                                  }}
                                  className="absolute top-1 right-1 w-6 h-6 p-0 bg-red-500 text-white hover:bg-red-600"
                                >
                                  ×
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="isActive">Status</Label>
                    <select
                      id="isActive"
                      value={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="isFeatured">Featured</Label>
                    <select
                      id="isFeatured"
                      value={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.value === 'true'})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value={false}>No</option>
                      <option value={true}>Yes</option>
                    </select>
                  </div>

                  {/* Sales Section */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Settings</h3>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="isOnSale">On Sale</Label>
                      <select
                        id="isOnSale"
                        value={formData.isOnSale}
                        onChange={(e) => setFormData({...formData, isOnSale: e.target.value === 'true'})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value={false}>No</option>
                        <option value={true}>Yes</option>
                      </select>
                    </div>

                    {formData.isOnSale && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="salePrice">Sale Price (SYP)</Label>
                            <Input
                              id="salePrice"
                              type="number"
                              step="0.01"
                              value={formData.salePrice}
                              onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                              placeholder="0.00"
                              min="0"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="saleBadge">Sale Badge (Optional)</Label>
                            <Input
                              id="saleBadge"
                              value={formData.saleBadge}
                              onChange={(e) => setFormData({...formData, saleBadge: e.target.value})}
                              placeholder="e.g., Sale, -30%, Limited Time"
                            />
                          </div>
                        </div>
                        
                        {formData.salePrice > 0 && formData.price > 0 && (
                          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-green-800">Sale Preview</p>
                                <p className="text-sm text-green-700">
                                  Original: SYP {formData.price} → Sale: SYP {formData.salePrice}
                                </p>
                                <p className="text-xs text-green-600">
                                  Discount: {Math.round(((formData.price - formData.salePrice) / formData.price) * 100)}% off
                                </p>
                              </div>
                              {formData.saleBadge && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                  {formData.saleBadge}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label>Available Colors</Label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map(color => (
                        <label key={color} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.selectedColors.includes(color)}
                            onChange={() => handleColorChange(color)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm">{color}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Available Sizes</Label>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map(size => (
                        <label key={size} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.selectedSizes.includes(size)}
                            onChange={() => handleSizeChange(size)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={uploading || isSubmitting || fileProcessing}>
                    {fileProcessing ? 'Processing...' : uploading ? 'Uploading...' : isSubmitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {products.map((product) => (
          <div key={product.id} className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="aspect-w-3 aspect-h-4 relative">
              {product.images && product.images.length > 0 ? (
                <img
                  src={getImageUrl(product.images[0].url)}
                  alt={product.name}
                  className="w-full h-40 sm:h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity duration-200"
                  onClick={() => openImageModal(product.images[0].url)}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{ display: product.images && product.images.length > 0 ? 'none' : 'flex' }}>
                <PhotoIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              </div>
              
              {/* Status Badges */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1">
                {product.isOnSale && (
                  <span className="inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full shadow-sm bg-red-100 text-red-800 border border-red-200">
                    🔥 Sale
                  </span>
                )}
                {product.isFeatured && (
                  <span className="inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full shadow-sm bg-yellow-100 text-yellow-800 border border-yellow-200">
                    <span className="hidden sm:inline">⭐ </span>Featured
                  </span>
                )}
                <span className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full shadow-sm ${
                  product.isActive 
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="mb-3">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate mb-1">{product.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">{product.description}</p>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-col">
                    {product.isOnSale && product.salePrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-red-600">SYP {product.salePrice}</span>
                        <span className="text-sm text-gray-500 line-through">SYP {product.price}</span>
                        {product.saleBadge && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {product.saleBadge}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">SYP {product.price}</span>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full self-start">
                    Stock: {product.stock}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">
                    {product.category?.name || 'No Category'}
                  </span>
                  {product.collection?.name && (
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full whitespace-nowrap">
                      {product.collection.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {/* Primary Actions Row - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm transition-colors duration-200"
                  >
                    <PencilIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Edit Product</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleManageProduct(product)}
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                  >
                    <PhotoIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Manage Images</span>
                  </Button>
                </div>
                
                {/* Danger Action Row */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors duration-200"
                >
                  <TrashIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Delete Product</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
          </div>
        </TabsContent>
        
        <TabsContent value="management" className="space-y-4">
          {selectedProductForManagement ? (
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Managing: {selectedProductForManagement.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Add colors and upload images for different color variants
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleBackToProducts}
                    className="flex items-center gap-2"
                  >
                    Back to Products
                  </Button>
                </div>
              </div>
              <ProductColorImageManager
                product={selectedProductForManagement}
                onUpdate={handleProductUpdate}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Product Selected
              </h3>
              <p className="text-gray-600">
                Click "Manage" on a product to start managing its colors and images.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="guide" className="space-y-4">
          <AdminGuide />
        </TabsContent>
      </Tabs>
      
      {/* Image Modal */}
      <ImageModal />
    </div>
  )
}

