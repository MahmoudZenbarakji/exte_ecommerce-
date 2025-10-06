import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { subcategoriesAPI, productsAPI } from '../services/api'
import ColorPicker from './ColorPicker.jsx'
import { useCart, useAuth, useFavorites } from '../contexts.jsx'
import FavoriteIcon from './FavoriteIcon.jsx'
import SaleBadge from './SaleBadge'
import SalePrice from './SalePrice'

function SubcategoryPage() {
  const { id } = useParams()
  const [subcategory, setSubcategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVariants, setSelectedVariants] = useState({})
  const [addingToCart, setAddingToCart] = useState({})

  const { addToCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { isFavorite } = useFavorites()

  // Auto-select first variant for products with variants
  useEffect(() => {
    const newSelectedVariants = {}
    products.forEach(product => {
      if (product.variants && product.variants.length > 0 && !selectedVariants[product.id]) {
        const firstVariant = product.variants[0]
        newSelectedVariants[product.id] = {
          color: firstVariant.color,
          size: firstVariant.size
        }
      }
    })
    if (Object.keys(newSelectedVariants).length > 0) {
      setSelectedVariants(prev => ({ ...prev, ...newSelectedVariants }))
    }
  }, [products, selectedVariants])

  useEffect(() => {
    const fetchSubcategoryData = async () => {
      try {
        setLoading(true)
        
        // Fetch subcategory details
        const subcategoryData = await subcategoriesAPI.getById(id)
        setSubcategory(subcategoryData)
        
        // Fetch products for this subcategory
        const productsData = await productsAPI.getAll({ 
          subcategoryId: id,
          isActive: true 
        })
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching subcategory data:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchSubcategoryData()
    }
  }, [id])

  const handleColorSelect = (productId, color) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        color: color
      }
    }))
  }

  const handleSizeSelect = (productId, size) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        size: size
      }
    }))
  }

  const handleAddToCart = async (product) => {
    console.log('SubcategoryPage: Add to cart clicked for product:', product)
    
    if (!isAuthenticated) {
      alert('Please login to add items to cart')
      return
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }))

    try {
      let color = null
      let size = null
      
      if (product.variants && product.variants.length > 0) {
        const variant = selectedVariants[product.id]
        if (variant?.color && variant?.size) {
          color = variant.color
          size = variant.size
        } else {
          // Fallback to first variant
          const firstVariant = product.variants[0]
          color = firstVariant.color
          size = firstVariant.size
        }
      }

      console.log('Adding to cart with:', { product: product.id, color, size, quantity: 1 })
      
      await addToCart(product, color, size, 1)
      alert('Product added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert(error.message || 'Failed to add product to cart')
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!subcategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Subcategory Not Found</h1>
          <p className="text-gray-600">The subcategory you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{subcategory.name}</h1>
          {subcategory.description && (
            <p className="mt-2 text-gray-600">{subcategory.description}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const variant = selectedVariants[product.id] || {}
              const isAdding = addingToCart[product.id] || false
              
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-200 relative">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url.startsWith('http') 
                          ? product.images[0].url 
                          : `http://localhost:3000${product.images[0].url}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    
                    {/* Sale Badge */}
                    <div className="absolute top-2 left-2">
                      <SaleBadge product={product} size="default" />
                    </div>
                    
                    {/* Favorite Icon */}
                    <div className="absolute top-2 right-2">
                      <FavoriteIcon 
                        productId={product.id} 
                        size="default"
                        className="hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mb-4">
                      <SalePrice product={product} size="default" />
                    </div>

                    {/* Color Picker */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="mb-3">
                        <ColorPicker
                          variants={product.variants}
                          selectedColor={variant.color}
                          onColorSelect={(color) => handleColorSelect(product.id, color)}
                        />
                      </div>
                    )}

                    {/* Size Selection */}
                    {product.variants && product.variants.length > 0 && variant.color && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Size
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {product.variants
                            .filter(v => v.color === variant.color)
                            .map((variantItem) => (
                              <button
                                key={variantItem.size}
                                onClick={() => handleSizeSelect(product.id, variantItem.size)}
                                className={`px-3 py-1 text-sm border rounded ${
                                  variant.size === variantItem.size
                                    ? 'border-gray-900 bg-gray-900 text-white'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                {variantItem.size}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {/* View Details Button */}
                      <Link
                        to={`/product/${product.id}`}
                        className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-900 rounded-md font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors text-center block"
                      >
                        View Details
                      </Link>
                      
                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isAdding}
                        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                          isAdding
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        {isAdding ? 'Adding...' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h2>
            <p className="text-gray-600">There are no products in this subcategory yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubcategoryPage
