import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Trash2 as TrashIcon, Plus as PlusIcon, Image as PhotoIcon, X as XMarkIcon } from 'lucide-react'
import { uploadAPI, productsAPI } from '../../services/api'
import { validateImage } from '../../utils/imageCompression.js'

const ProductColorImageManager = ({ product, onUpdate }) => {
  const [colors, setColors] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newColor, setNewColor] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  // Initialize colors from product data
  useEffect(() => {
    if (product) {
      const productColors = new Set()
      
      // Get colors from variants
      if (product.variants) {
        product.variants.forEach(variant => {
          if (variant.color) {
            productColors.add(variant.color)
          }
        })
      }
      
      // Get colors from images
      if (product.images) {
        product.images.forEach(image => {
          if (image.color) {
            productColors.add(image.color)
          }
        })
      }
      
      setColors(Array.from(productColors))
      if (productColors.size > 0) {
        setSelectedColor(Array.from(productColors)[0])
      }
    }
  }, [product])

  // Add new color
  const addColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()])
      setNewColor('')
    }
  }

  // Remove color
  const removeColor = (colorToRemove) => {
    setColors(colors.filter(color => color !== colorToRemove))
    if (selectedColor === colorToRemove) {
      setSelectedColor(colors.length > 1 ? colors[0] : '')
    }
  }

  // Get images for selected color
  const getImagesForColor = (color) => {
    if (!product?.images) return []
    return product.images.filter(image => image.color === color)
  }

  // Handle file upload for specific color
  const handleFileUpload = async (event, color) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    // Validate all files first
    for (const file of files) {
      const validation = validateImage(file)
      if (!validation.valid) {
        alert(`Invalid file: ${file.name} - ${validation.error}`)
        return
      }
    }

    setUploading(true)
    try {
      console.log('🚀 Starting batch upload for', files.length, 'images...')
      
      // Skip client-side compression to avoid multiple requests
      // Let the server handle optimization instead
      console.log('📤 Uploading images directly to server...')
      
      // Use the multiple upload endpoint to upload all files in one request
      const uploadResults = await uploadAPI.uploadMultipleProductImages(files, color, product.id)
      
      // Refresh product data
      if (onUpdate) {
        onUpdate()
      }
      
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Error uploading images. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Remove image
  const removeImage = async (imageId) => {
    try {
      await productsAPI.removeImage(product.id, imageId)
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error removing image:', error)
      alert('Error removing image. Please try again.')
    }
  }

  // Helper function to get color hex value
  const getColorHex = (colorName) => {
    const colorMap = {
      'black': '#000000',
      'white': '#ffffff',
      'red': '#ef4444',
      'blue': '#3b82f6',
      'green': '#10b981',
      'yellow': '#f59e0b',
      'pink': '#ec4899',
      'purple': '#8b5cf6',
      'gray': '#6b7280',
      'brown': '#92400e',
      'navy': '#1e3a8a',
      'beige': '#f5f5dc',
      'cream': '#f5f5dc',
      'light blue': '#93c5fd',
      'orange': '#f97316'
    }
    return colorMap[colorName.toLowerCase()] || '#6b7280'
  }

  if (!product) {
    return <div>No product selected</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color & Image Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Color */}
          <div className="flex gap-2">
            <Input
              placeholder="Add new color (e.g., Red, Blue, Green)"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addColor()}
            />
            <Button onClick={addColor} disabled={!newColor.trim()}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Color
            </Button>
          </div>

          {/* Color List */}
          <div className="space-y-3">
            <Label>Available Colors</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                    selectedColor === color ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: getColorHex(color) }}
                  />
                  <span className="text-sm font-medium">{color}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                    className="h-6 w-6 p-0"
                  >
                    {selectedColor === color ? '✓' : '○'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeColor(color)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Management for Selected Color */}
      {selectedColor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: getColorHex(selectedColor) }}
              />
              {selectedColor} Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Images for Color */}
            <div>
              <Label htmlFor={`upload-${selectedColor}`} className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <PhotoIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload images for {selectedColor}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    You can select multiple images at once
                  </p>
                </div>
              </Label>
              <Input
                id={`upload-${selectedColor}`}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e, selectedColor)}
                className="hidden"
                disabled={uploading}
              />
            </div>

            {/* Display Images for Color */}
            <div>
              <Label>Current Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {getImagesForColor(selectedColor).map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={
                        image.url.startsWith('http') 
                          ? image.url 
                          : `http://localhost:3000${image.url}`
                      }
                      alt={`${selectedColor} product image`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    {image.isMain && (
                      <Badge className="absolute top-2 left-2 bg-blue-500">
                        Main
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              {getImagesForColor(selectedColor).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No images uploaded for {selectedColor} yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {uploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            Uploading images...
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductColorImageManager
