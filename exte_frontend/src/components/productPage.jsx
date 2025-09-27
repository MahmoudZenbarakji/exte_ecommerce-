import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Heart, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react'
import {Button} from './ui/button'
import { useCart, useAuth, useFavorites } from '../contexts.jsx'
import { productsAPI } from '../services/api.js'
import ProductColorSelector from './ProductColorSelector.jsx'
import FavoriteIcon from './FavoriteIcon.jsx'
import SaleBadge from './SaleBadge'
import SalePrice from './SalePrice'

function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { isFavorite } = useFavorites()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [currentImages, setCurrentImages] = useState([])

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const productData = await productsAPI.getById(productId)
        setProduct(productData)
        
        // Set default size from variants
        if (productData.variants && productData.variants.length > 0) {
          setSelectedSize(productData.variants[0].size)
        }
        
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Handle color change from ProductColorSelector
  const handleColorChange = (color) => {
    setSelectedColor(color)
  }

  // Handle image change from ProductColorSelector
  const handleImageChange = (images) => {
    setCurrentImages(images)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-900">Error loading product</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <Link to="/" className="text-black hover:text-gray-700 mt-4 inline-block">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-900">Product not found</h2>
          <Link to="/" className="text-black hover:text-gray-700 mt-4 inline-block">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Redirect to registration page for unauthenticated users
      navigate('/register')
      return
    }

    if (!selectedColor || !selectedSize) {
      alert('Please select both color and size before adding to cart')
      return
    }

    // Get the current image for the selected color
    const currentImage = currentImages.length > 0 ? currentImages[0]?.url : 
                        (product.images && product.images.length > 0 ? product.images[0].url : null)

    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedColor, selectedSize, 1)
    }

    // Show success message or redirect to cart
    const goToCart = window.confirm('Product added to cart! Would you like to view your cart?')
    if (goToCart) {
      navigate('/cart')
    }
  }

  // Get available sizes from variants
  const availableSizes = product?.variants ? 
    [...new Set(product.variants.map(v => v.size))] : []

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Product Color Selector with Image Gallery */}
          <div className="flex flex-col">
            <ProductColorSelector
              product={product}
              onColorChange={handleColorChange}
              onImageChange={handleImageChange}
              className="w-full"
            />
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-3xl font-light text-gray-900">{product.name}</h1>
              <SaleBadge product={product} size="lg" />
            </div>
            <div className="mt-3">
              <SalePrice product={product} size="lg" />
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <p className="text-base text-gray-700">{product.description}</p>
            </div>

            <div className="mt-8">
              {/* Size picker */}
              {availableSizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <a href="#" className="text-sm font-medium text-black hover:text-gray-700">
                      Size guide
                    </a>
                  </div>

                  <div className="mt-4">
                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 ${
                            selectedSize === size
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-900 border-gray-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                <div className="mt-4 flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-t border-b border-gray-300 bg-white text-center min-w-[60px]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <div className="mt-10 flex sm:flex-col1">
                {(() => {
                  const hasVariants = product?.variants && product.variants.length > 0
                  const variantSelected = hasVariants ? (selectedColor && selectedSize) : true
                  const canAddToCart = variantSelected
                  
                  return (
                    <Button
                      onClick={handleAddToCart}
                      disabled={!canAddToCart}
                      className={`max-w-xs flex-1 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:w-full ${
                        canAddToCart 
                          ? 'bg-black text-white hover:bg-gray-800' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {hasVariants && !variantSelected ? (
                        'Select Color & Size'
                      ) : (
                        <>
                          <ShoppingBag className="h-5 w-5 mr-2" />
                          Add to cart
                        </>
                      )}
                    </Button>
                  )
                })()}

                <div className="ml-4 flex items-center">
                  <FavoriteIcon 
                    productId={product.id} 
                    size="lg"
                    className="hover:scale-110 transition-transform duration-200"
                  />
                </div>
              </div>

              {/* Product details */}
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">Product Information</h3>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 space-y-2">
                    <p><strong>Category:</strong> {product.category?.name || 'N/A'}</p>
                    {product.subcategory && (
                      <p><strong>Subcategory:</strong> {product.subcategory.name}</p>
                    )}
                    {product.collection && (
                      <p><strong>Collection:</strong> {product.collection.name}</p>
                    )}
                    <p><strong>SKU:</strong> {product.sku || 'N/A'}</p>
                    <p><strong>Stock:</strong> {product.stock || 0} available</p>
                    {product.variants && product.variants.length > 0 && (
                      <div>
                        <p><strong>Available Variants:</strong></p>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          {product.variants.map((variant, index) => (
                            <li key={index}>
                              {variant.color} - {variant.size} 
                              {variant.stock !== undefined && ` (${variant.stock} in stock)`}
                              {variant.price && ` - SYP ${variant.price}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping info */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="text-sm font-medium text-gray-900">Shipping & Returns</h3>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Free shipping on orders over SYP 50</p>
                  <p>Free returns within 30 days</p>
                  <p>Express delivery available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

