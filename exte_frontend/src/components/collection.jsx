import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { collectionsAPI, productsAPI } from '../services'
import { Heart, ShoppingCart, Plus, Eye } from 'lucide-react'
import { Button } from './ui/button.jsx'
import ColorPicker from './ColorPicker.jsx'
import { useCart, useAuth } from '../contexts'

export default function Collection() {
  const { collectionName } = useParams()
  const [collection, setCollection] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedVariants, setSelectedVariants] = useState({})
  const [addingToCart, setAddingToCart] = useState({})

  const { addToCart } = useCart()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (collectionName) {
      fetchCollectionData()
    }
  }, [collectionName])

  const fetchCollectionData = async () => {
    try {
      setLoading(true)
      // First, get all collections to find the one matching the name
      const collections = await collectionsAPI.getAll()
      const matchedCollection = collections.find(c => 
        c.name.toLowerCase().replace(/\s+/g, '-') === collectionName.toLowerCase()
      )
      
      if (matchedCollection) {
        setCollection(matchedCollection)
        // Get products for this collection
        const collectionProducts = await productsAPI.getAll({ 
          collectionId: matchedCollection.id,
          isActive: true 
        })
        setProducts(collectionProducts)
      } else {
        setError('Collection not found')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch collection data')
      console.error('Error fetching collection data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product, selectedColor, selectedSize) => {
    if (!isAuthenticated) {
      alert('Please log in to add items to cart')
      return
    }

    const key = `${product.id}-${selectedColor}-${selectedSize}`
    setAddingToCart(prev => ({ ...prev, [key]: true }))

    try {
      // Find the variant that matches the selected color and size
      const variant = product.variants?.find(v => 
        v.color === selectedColor && v.size === selectedSize
      )

      if (!variant) {
        throw new Error('Selected variant not found')
      }

      const cartItem = {
        productId: product.id,
        color: selectedColor,
        size: selectedSize,
        quantity: 1,
        price: variant.price || product.price
      }

      await addToCart(cartItem)
      console.log('Product added to cart successfully')
    } catch (err) {
      console.error('Error adding to cart:', err)
      alert('Failed to add item to cart')
    } finally {
      setAddingToCart(prev => ({ ...prev, [key]: false }))
    }
  }

  const handleVariantChange = (productId, color, size) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: { color, size }
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading collection...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Collection Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Collection Not Found</h1>
          <p className="text-gray-600 mb-8">The collection you're looking for doesn't exist.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Collection Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 mb-4">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {collection.description}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-4">
              {products.length} {products.length === 1 ? 'product' : 'products'} in this collection
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-light text-gray-900 mb-4">No Products Yet</h2>
            <p className="text-gray-600">This collection doesn't have any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const mainImage = product.images?.find(img => img.isMain) || product.images?.[0]
              const imageUrl = mainImage?.url 
                ? mainImage.url.startsWith('http') 
                  ? mainImage.url 
                  : `http://localhost:3000${mainImage.url}`
                : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop"

              const selectedVariant = selectedVariants[product.id]
              const availableColors = [...new Set(product.variants?.map(v => v.color) || [])]
              const availableSizes = selectedVariant?.color 
                ? [...new Set(product.variants?.filter(v => v.color === selectedVariant.color).map(v => v.size) || [])]
                : [...new Set(product.variants?.map(v => v.size) || [])]

              return (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/90 hover:bg-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold text-gray-900">
                        {product.price} SYP
                      </span>
                      {product.stock > 0 && (
                        <span className="text-sm text-green-600">In Stock</span>
                      )}
                    </div>

                    {/* Color and Size Selection */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {availableColors.length > 1 && (
                          <ColorPicker
                            colors={availableColors}
                            selectedColor={selectedVariant?.color}
                            onColorChange={(color) => handleVariantChange(product.id, color, selectedVariant?.size)}
                          />
                        )}
                        
                        {availableSizes.length > 1 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Size
                            </label>
                            <div className="flex flex-wrap gap-1">
                              {availableSizes.map((size) => (
                                <button
                                  key={size}
                                  onClick={() => handleVariantChange(product.id, selectedVariant?.color, size)}
                                  className={`px-2 py-1 text-xs border rounded ${
                                    selectedVariant?.size === size
                                      ? 'border-gray-900 bg-gray-900 text-white'
                                      : 'border-gray-300 hover:border-gray-400'
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={() => {
                          const color = selectedVariant?.color || availableColors[0]
                          const size = selectedVariant?.size || availableSizes[0]
                          handleAddToCart(product, color, size)
                        }}
                        disabled={addingToCart[`${product.id}-${selectedVariant?.color || availableColors[0]}-${selectedVariant?.size || availableSizes[0]}`]}
                      >
                        {addingToCart[`${product.id}-${selectedVariant?.color || availableColors[0]}-${selectedVariant?.size || availableSizes[0]}`] ? (
                          'Adding...'
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                      
                      <Link to={`/product/${product.id}`} className="block">
                        <Button
                          variant="outline"
                          className="w-full"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
