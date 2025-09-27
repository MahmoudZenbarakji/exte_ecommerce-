import { Link, useNavigate } from 'react-router-dom'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useFeaturedProducts } from '../hooks/useProducts'
import { usePerformance } from '../hooks/usePerformance'
import { collectionsAPI } from '../services/api'
import OptimizedProductCard from './OptimizedProductCard'
import OptimizedImage from './OptimizedImage'

function OptimizedHome() {
  const navigate = useNavigate()
  const { measureRender } = usePerformance()
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [collectionsPerPage] = useState(4)
  const [collections, setCollections] = useState([])
  const [collectionsLoading, setCollectionsLoading] = useState(true)
  
  // State for image modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState('')
  
  // Fetch data using optimized hooks
  const { data: featuredProducts = [], isLoading: productsLoading } = useFeaturedProducts()

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await collectionsAPI.getAll()
        // Filter only active collections
        const activeCollections = data.filter(collection => collection.isActive)
        setCollections(activeCollections)
      } catch (error) {
        console.error('Error fetching collections:', error)
      } finally {
        setCollectionsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(collections.length / collectionsPerPage)
    const startIndex = (currentPage - 1) * collectionsPerPage
    const endIndex = startIndex + collectionsPerPage
    const currentCollections = collections.slice(startIndex, endIndex)
    
    return {
      totalPages,
      currentCollections,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    }
  }, [collections, currentPage, collectionsPerPage])

  // Memoized handlers
  const handlePreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }, [])

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages))
  }, [paginationData.totalPages])

  const handleCollectionClick = useCallback((collectionName) => {
    navigate(`/collection/${collectionName.toLowerCase().replace(/\s+/g, '-')}`)
  }, [navigate])

  // Image modal functions
  const openImageModal = useCallback((imageUrl) => {
    setSelectedImageUrl(imageUrl)
    setIsImageModalOpen(true)
  }, [])

  const closeImageModal = useCallback(() => {
    setIsImageModalOpen(false)
    setSelectedImageUrl('')
  }, [])

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
  }, [isImageModalOpen, closeImageModal])

  // Note: OptimizedProductCard handles its own cart logic
  // No need for handleAddToCart here since OptimizedProductCard uses context directly

  // Memoized collection cards
  const collectionCards = useMemo(() => {
    return paginationData.currentCollections.map((collection) => {
      const imageUrl = collection.image 
        ? collection.image.startsWith('http') 
          ? collection.image 
          : `http://localhost:3000${collection.image}`
        : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop"
      
      return (
        <div key={collection.id} className="relative group cursor-pointer">
          {/* Card Container with Modern Styling */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white">
            {/* Image Container */}
            <div className="relative h-80 overflow-hidden">
              <OptimizedImage
                src={imageUrl}
                alt={collection.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onClick={() => openImageModal(imageUrl)}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              {/* Top Badge */}
              <div className="flex justify-end">
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  COLLECTION
                </span>
              </div>
              
              {/* Bottom Content */}
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <Link 
                  to={`/collection/${collection.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
                    {collection.name.toUpperCase()}
                  </h3>
                  <p className="text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    Discover our latest {collection.name.toLowerCase()} collection
                  </p>
                </Link>
              </div>
            </div>
            
            {/* Bottom Border Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </div>
        </div>
      )
    })
  }, [paginationData.currentCollections, openImageModal])

  // Memoized featured products
  const featuredProductsCards = useMemo(() => {
    return featuredProducts.slice(0, 8).map((product) => (
      <OptimizedProductCard
        key={product.id}
        product={product}
      />
    ))
  }, [featuredProducts])

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
              src={selectedImageUrl}
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

  return measureRender('OptimizedHome', () => (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-light mb-4">Welcome to EXTE</h1>
          <p className="text-xl mb-8">Discover our latest collection</p>
          <Link 
            to="/category/man" 
            className="inline-block px-8 py-3 bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>




      {/* Collections Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Collection</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our curated collections designed to inspire your style
            </p>
          </div>
          
          {collectionsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {collectionCards}
              </div>
              
              {/* Pagination */}
              {paginationData.totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={!paginationData.hasPrevPage}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      paginationData.hasPrevPage
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {currentPage} of {paginationData.totalPages}
                  </span>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={!paginationData.hasNextPage}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      paginationData.hasNextPage
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12">Featured Products</h2>
          
          {productsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProductsCards}
            </div>
          )}
          
          {featuredProducts.length > 8 && (
            <div className="text-center mt-12">
              <Link 
                to="/products" 
                className="inline-block px-8 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Image Modal */}
      <ImageModal />
    </div>
  ))
}

export default OptimizedHome
