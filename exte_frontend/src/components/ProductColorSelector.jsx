import { useState, useEffect, useCallback } from 'react'

const ProductColorSelector = ({ 
  product, 
  onColorChange = () => {},
  onImageChange = () => {},
  className = ""
}) => {
  const [selectedColor, setSelectedColor] = useState('')
  const [currentImages, setCurrentImages] = useState([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState('')
  const [modalImageIndex, setModalImageIndex] = useState(0)

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

  // Helper function to get contrast color for text
  const getContrastColor = (hexColor) => {
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000
    return brightness > 128 ? '#000000' : '#ffffff'
  }

  // Get available colors from product images and variants
  const getAvailableColors = () => {
    const colors = new Set()
    
    // Get colors from images
    if (product?.images) {
      product.images.forEach(image => {
        if (image.color) {
          colors.add(image.color)
        }
      })
    }
    
    // Get colors from variants
    if (product?.variants) {
      product.variants.forEach(variant => {
        if (variant.color) {
          colors.add(variant.color)
        }
      })
    }
    
    return Array.from(colors)
  }

  // Get images for selected color
  const getImagesForColor = (color) => {
    if (!product?.images) return []
    
    if (color) {
      // Filter images by color
      const colorImages = product.images.filter(image => 
        image.color?.toLowerCase() === color.toLowerCase()
      )
      return colorImages.length > 0 ? colorImages : product.images
    }
    
    return product.images
  }

  // Initialize with first available color
  useEffect(() => {
    if (product) {
      const availableColors = getAvailableColors()
      if (availableColors.length > 0 && !selectedColor) {
        const firstColor = availableColors[0]
        setSelectedColor(firstColor)
        const images = getImagesForColor(firstColor)
        setCurrentImages(images)
        onColorChange(firstColor)
        onImageChange(images)
      } else if (product.images && product.images.length > 0) {
        setCurrentImages(product.images)
        onImageChange(product.images)
      }
    }
  }, [product])

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color)
    setSelectedImageIndex(0) // Reset to first image
    
    const images = getImagesForColor(color)
    setCurrentImages(images)
    
    onColorChange(color)
    onImageChange(images)
  }

  // Handle image selection
  const handleImageSelect = (index) => {
    setSelectedImageIndex(index)
  }

  // Image modal functions
  const openImageModal = useCallback((imageUrl, imageIndex = 0) => {
    setSelectedImageUrl(imageUrl)
    setModalImageIndex(imageIndex)
    setIsImageModalOpen(true)
  }, [])

  const closeImageModal = useCallback(() => {
    setIsImageModalOpen(false)
    setSelectedImageUrl('')
    setModalImageIndex(0)
  }, [])

  // Modal image navigation functions
  const navigateToPreviousImage = useCallback(() => {
    if (currentImages.length > 1) {
      const newIndex = modalImageIndex === 0 ? currentImages.length - 1 : modalImageIndex - 1
      setModalImageIndex(newIndex)
      const imageUrl = currentImages[newIndex]?.url?.startsWith('http') 
        ? currentImages[newIndex].url
        : `http://localhost:3000${currentImages[newIndex]?.url}`
      setSelectedImageUrl(imageUrl)
    }
  }, [currentImages, modalImageIndex])

  const navigateToNextImage = useCallback(() => {
    if (currentImages.length > 1) {
      const newIndex = modalImageIndex === currentImages.length - 1 ? 0 : modalImageIndex + 1
      setModalImageIndex(newIndex)
      const imageUrl = currentImages[newIndex]?.url?.startsWith('http') 
        ? currentImages[newIndex].url
        : `http://localhost:3000${currentImages[newIndex]?.url}`
      setSelectedImageUrl(imageUrl)
    }
  }, [currentImages, modalImageIndex])

  // Handle keyboard navigation in modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isImageModalOpen) return

      switch (event.key) {
        case 'Escape':
          closeImageModal()
          break
        case 'ArrowLeft':
          event.preventDefault()
          navigateToPreviousImage()
          break
        case 'ArrowRight':
          event.preventDefault()
          navigateToNextImage()
          break
        default:
          break
      }
    }

    if (isImageModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isImageModalOpen, closeImageModal, navigateToPreviousImage, navigateToNextImage])

  const availableColors = getAvailableColors()

  if (!product || availableColors.length === 0) {
    return null
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
          
          {/* Navigation Arrows - Only show if multiple images */}
          {currentImages.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateToPreviousImage()
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black bg-opacity-50 rounded-full p-3"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateToNextImage()
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black bg-opacity-50 rounded-full p-3"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Image Container */}
          <div 
            className="relative bg-white rounded-lg shadow-2xl overflow-hidden max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImageUrl}
              alt="Product image"
              className="w-full h-auto max-h-[80vh] object-contain"
              onError={(e) => {
                e.target.src = '/placeholder-image.png'
              }}
            />
          </div>
          
          {/* Image Indicators - Only show if multiple images */}
          {currentImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {currentImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setModalImageIndex(index)
                    const imageUrl = currentImages[index]?.url?.startsWith('http') 
                      ? currentImages[index].url
                      : `http://localhost:3000${currentImages[index]?.url}`
                    setSelectedImageUrl(imageUrl)
                  }}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    modalImageIndex === index 
                      ? 'bg-white' 
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          {/* Image Counter */}
          {currentImages.length > 1 && (
            <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 rounded-full px-3 py-1 text-sm z-10">
              {modalImageIndex + 1} / {currentImages.length}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`product-color-selector ${className}`}>
      {/* Color Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
        <div className="flex items-center space-x-3">
          {availableColors.map((color) => {
            const isSelected = selectedColor === color
            const colorHex = getColorHex(color)
            const textColor = getContrastColor(colorHex)
            
            return (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`relative rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ${
                  isSelected ? 'border-gray-800 ring-2 ring-gray-300' : 'border-gray-300'
                } w-10 h-10`}
                title={color}
              >
                <span className="sr-only">{color}</span>
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-xs font-medium"
                  style={{ 
                    backgroundColor: colorHex,
                    color: textColor
                  }}
                >
                  {color.charAt(0).toUpperCase()}
                </div>
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-sm text-gray-600">Selected: {selectedColor}</p>
      </div>

      {/* Image Gallery */}
      {currentImages.length > 0 && (
        <div className="space-y-4">
          {/* Main Image */}
          <div className="w-full aspect-w-1 aspect-h-1">
            <img
              src={
                currentImages[selectedImageIndex]?.url?.startsWith('http') 
                  ? currentImages[selectedImageIndex].url
                  : `http://localhost:3000${currentImages[selectedImageIndex]?.url}`
              }
              alt={`${product.name} - ${selectedColor}`}
              className="w-full h-full object-center object-cover sm:rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
              onClick={() => openImageModal(
                currentImages[selectedImageIndex]?.url?.startsWith('http') 
                  ? currentImages[selectedImageIndex].url
                  : `http://localhost:3000${currentImages[selectedImageIndex]?.url}`,
                selectedImageIndex
              )}
            />
          </div>

          {/* Image Thumbnails */}
          {currentImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {currentImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  className={`relative h-20 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-25 ${
                    selectedImageIndex === index ? 'ring-2 ring-black' : ''
                  }`}
                >
                  <img
                    src={
                      image.url?.startsWith('http') 
                        ? image.url
                        : `http://localhost:3000${image.url}`
                    }
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      openImageModal(
                        image.url?.startsWith('http') 
                          ? image.url
                          : `http://localhost:3000${image.url}`,
                        index
                      )
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Image Modal */}
      <ImageModal />
    </div>
  )
}

export default ProductColorSelector


















