import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Plus } from 'lucide-react'
import { Button } from './ui/button.jsx'
import { useState, useEffect } from 'react'
import { categoriesAPI, productsAPI, collectionsAPI } from '../services/api.js'
import ColorPicker from './ColorPicker.jsx'
import { useCart, useAuth } from '../contexts.jsx'


function Home() {
  const [collections, setCollections] = useState([])
  const [collectionsLoading, setCollectionsLoading] = useState(true)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [collectionsPerPage] = useState(4) // Show 4 collections per page
  const [selectedVariants, setSelectedVariants] = useState({}) // Track selected color/size for each product
  const [addingToCart, setAddingToCart] = useState({}) // Track which products are being added to cart
  const [currentImageIndex, setCurrentImageIndex] = useState({}) // Track current image index for each product

  // Get cart and auth context
  const { addToCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  
  // Debug authentication
  useEffect(() => {
    console.log('Home component - isAuthenticated:', isAuthenticated)
    console.log('Home component - user:', user)
    console.log('Home component - token:', localStorage.getItem('access_token'))
  }, [isAuthenticated, user])

  // Handle image navigation
  const handleImageNavigation = (productId, direction) => {
    const product = featuredProducts.find(p => p.id === productId)
    if (!product || !product.images || product.images.length <= 1) return

    const currentIndex = currentImageIndex[productId] || 0
    let newIndex = currentIndex

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % product.images.length
    } else if (direction === 'prev') {
      newIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1
    }

    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: newIndex
    }))
  }

  // Get current image for a product
  const getCurrentImage = (product) => {
    if (!product.images || product.images.length === 0) {
      return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop"
    }

    const currentIndex = currentImageIndex[product.id] || 0
    const imageUrl = product.images[currentIndex]?.url

    if (!imageUrl) {
      return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop"
    }

    return imageUrl.startsWith('http') ? imageUrl : `http://localhost:3000${imageUrl}`
  }


  // Fetch collections from API
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await collectionsAPI.getAll()
        console.log('Fetched collections:', data)
        // Filter only active collections
        const activeCollections = data.filter(collection => collection.isActive)
        console.log('Active collections:', activeCollections)
        setCollections(activeCollections)
      } catch (error) {
        console.error('Error fetching collections:', error)
      } finally {
        setCollectionsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  // Fetch featured products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getAll({ isFeatured: true, isActive: true })
        console.log('Fetched featured products:', data)
        console.log('First product structure:', data[0])
        if (data[0]?.variants) {
          console.log('First product variants:', data[0].variants)
        }
        setFeaturedProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setProductsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Pagination logic
  const indexOfLastCollection = currentPage * collectionsPerPage
  const indexOfFirstCollection = indexOfLastCollection - collectionsPerPage
  const currentCollections = collections.slice(indexOfFirstCollection, indexOfLastCollection)
  const totalPages = Math.ceil(collections.length / collectionsPerPage)

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    // Scroll to collections section when page changes
    const collectionsSection = document.getElementById('collections-section')
    if (collectionsSection) {
      collectionsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Handle color selection for products
  const handleColorSelect = (productId, color) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        color: color
      }
    }))
  }

  // Handle size selection for products
  const handleSizeSelect = (productId, size) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        size: size
      }
    }))
  }

  // Handle adding product to cart
  const handleAddToCart = async (product) => {
    console.log('handleAddToCart called for product:', product)
    console.log('isAuthenticated:', isAuthenticated)
    console.log('selectedVariants:', selectedVariants)
    
    if (!isAuthenticated) {
      // Redirect to registration page for unauthenticated users
      navigate('/register')
      return
    }

    const variant = selectedVariants[product.id]
    const selectedColor = variant?.color
    const selectedSize = variant?.size

    console.log('Selected color:', selectedColor, 'Selected size:', selectedSize)

    // Check if product has variants and if color/size is selected
    if (product.variants && product.variants.length > 0) {
      if (!selectedColor || !selectedSize) {
        alert('Please select both color and size before adding to cart')
        return
      }
    }

    try {
      setAddingToCart(prev => ({ ...prev, [product.id]: true }))
      console.log('Calling addToCart with:', { product, selectedColor, selectedSize, quantity: 1 })
      await addToCart(product, selectedColor, selectedSize, 1)
      alert('Product added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert(error.message || 'Failed to add product to cart')
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }))
    }
  }


  return (
    <div>
      {/* Hero Section with Video */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/6479/6479-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop"
            alt="Fashion collection"
            className="w-full h-full object-cover"
          />
        </video>
        <div className="absolute inset-0  bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-6xl font-light mb-4">NEW COLLECTION</h2>
            <p className="text-lg md:text-xl mb-8">Discover the latest trends</p>
            <Button className=" text-black hover:bg-gray-100 px-8 py-3 text-sm font-medium">
              SHOP NOW
            </Button>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section id="collections-section" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-center mb-12">SHOP BY COLLECTION</h2>
          {collectionsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading collections...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentCollections.map((collection) => {
                  const imageUrl = collection.image 
                    ? collection.image.startsWith('http') 
                      ? collection.image 
                      : `http://localhost:3000${collection.image}`
                    : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop";
                  
                  console.log(`Collection: ${collection.name}, Original image: ${collection.image}, Final URL: ${imageUrl}`);
                  
                  return (
                    <Link 
                      key={collection.id} 
                      to={`/collection/${collection.name.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="relative group cursor-pointer"
                    >
                      <img
                        src={imageUrl}
                        alt={collection.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.error('Image failed to load:', e.target.src);
                          console.error('Original collection image:', collection.image);
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', collection.name);
                        }}
                      />
                      <div className="absolute inset-0 flex items-end p-4">
                        <h3 className="text-white text-xl font-medium drop-shadow-lg">{collection.name.toUpperCase()}</h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  
                  {/* Next Button */}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
              
              {/* Page Info */}
              {categories.length > 0 && (
                <div className="text-center mt-4 text-gray-600 text-sm">
                  Showing {indexOfFirstCategory + 1} to {Math.min(indexOfLastCategory, categories.length)} of {categories.length} categories
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-center mb-12">TRENDING NOW</h2>
          {productsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading products...</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => {
                const hasMultipleImages = product.images && product.images.length > 1
                const currentImageUrl = getCurrentImage(product)

                return (
                  <div key={product.id} className="group cursor-pointer">
                    <Link to={`/product/${product.id}`}>
                      <div className="relative overflow-hidden">
                        <img
                          src={currentImageUrl}
                          alt={product.name}
                          className="w-full h-80 md:h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Image navigation arrows - only show if multiple images */}
                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleImageNavigation(product.id, 'prev')
                              }}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleImageNavigation(product.id, 'next')
                              }}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        )}

                        {/* Image indicators - only show if multiple images */}
                        {hasMultipleImages && (
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {product.images.map((_, index) => (
                              <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${
                                  (currentImageIndex[product.id] || 0) === index 
                                    ? 'bg-white' 
                                    : 'bg-white bg-opacity-50'
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart className="h-6 w-6 text-white hover:fill-current cursor-pointer" />
                        </div>
                      </div>
                    </Link>
                    <div className="mt-4">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs text-gray-500">{product.category?.name || 'Category'}</p>
                        {hasMultipleImages && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            {product.images.length} photos
                          </span>
                        )}
                      </div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-sm font-medium mb-2 hover:text-gray-600">{product.name}</h3>
                      </Link>
                      <p className="text-sm font-semibold">SYP {product.price}</p>
                      
                      {/* Color selection preview */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="mt-2">
                          <ColorPicker
                            colors={[...new Set(product.variants.map(v => v.color))]}
                            size="sm"
                            showLabels={true}
                            maxDisplay={4}
                            selectedColor={selectedVariants[product.id]?.color}
                            onColorSelect={(color) => handleColorSelect(product.id, color)}
                          />
                        </div>
                      )}

                      {/* Size selection */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Size:</p>
                          <div className="flex flex-wrap gap-1">
                            {[...new Set(product.variants.map(v => v.size))].map(size => (
                              <button
                                key={size}
                                onClick={() => handleSizeSelect(product.id, size)}
                                className={`px-2 py-1 text-xs border rounded ${
                                  selectedVariants[product.id]?.size === size
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add to Cart Button */}
                      <div className="mt-3">
                        {(() => {
                          const hasVariants = product.variants && product.variants.length > 0
                          const variantSelected = hasVariants ? 
                            (selectedVariants[product.id]?.color && selectedVariants[product.id]?.size) : 
                            true
                          const canAddToCart = variantSelected && !addingToCart[product.id]
                          
                          return (
                            <Button
                              onClick={() => handleAddToCart(product)}
                              disabled={!canAddToCart}
                              className={`w-full text-xs py-2 ${
                                canAddToCart 
                                  ? 'bg-black text-white hover:bg-gray-800' 
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {addingToCart[product.id] ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                  Adding...
                                </>
                              ) : hasVariants && !variantSelected ? (
                                'Select Color & Size'
                              ) : (
                                <>
                                  <ShoppingCart className="h-3 w-3 mr-2" />
                                  Add to Cart
                                </>
                              )}
                            </Button>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home

