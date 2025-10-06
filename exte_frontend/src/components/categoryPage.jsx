import { useParams, Link, useNavigate } from 'react-router-dom'
import { Heart, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
import { productsAPI, categoriesAPI, subcategoriesAPI } from '../services'
import ColorPicker from './ColorPicker.jsx'
import { useCart, useAuth, useFavorites } from '../contexts'
import FavoriteIcon from './FavoriteIcon.jsx'
import SaleBadge from './SaleBadge'
import SalePrice from './SalePrice'

function CategoryPage() {
  const { categoryName } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { isFavorite } = useFavorites()
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [categoryProducts, setCategoryProducts] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [, setCategory] = useState(null)
  const [selectedVariants, setSelectedVariants] = useState({})
  const [addingToCart, setAddingToCart] = useState({})

  // Auto-select first variant for products with variants
  useEffect(() => {
    const newSelectedVariants = {}
    categoryProducts.forEach(product => {
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
  }, [categoryProducts, selectedVariants])

  // Handle adding product to cart
  const handleAddToCart = async (product) => {
    console.log('CategoryPage: Add to cart clicked for product:', product)
    
    if (!isAuthenticated) {
      navigate('/register')
      return
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }))

    try {
      let color = null
      let size = null
      
      if (product.variants && product.variants.length > 0) {
        const selectedVariant = selectedVariants[product.id]
        if (selectedVariant) {
          color = selectedVariant.color
          size = selectedVariant.size
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

  // Handle color selection
  const handleColorSelect = (productId, color) => {
    const product = categoryProducts.find(p => p.id === productId)
    if (product && product.variants) {
      const availableSizes = product.variants
        .filter(v => v.color === color)
        .map(v => v.size)
      const firstSize = availableSizes[0]
      
      setSelectedVariants(prev => ({
        ...prev,
        [productId]: { color, size: firstSize }
      }))
    }
  }

  // Fetch products for this category
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true)
        
        // First, get all categories to find the one that matches
        const categories = await categoriesAPI.getAll()
        const matchedCategory = categories.find(cat => 
          cat.name.toLowerCase() === categoryName.toLowerCase()
        )
        
        if (matchedCategory) {
          setCategory(matchedCategory)
          
          // Fetch subcategories for this category
          const subcategoriesData = await subcategoriesAPI.getByCategory(matchedCategory.id)
          setSubcategories(subcategoriesData.filter(sub => sub.isActive))
          
          // Fetch products for this category
          const products = await productsAPI.getAll({ 
            categoryId: matchedCategory.id,
            isActive: true 
          })
          setCategoryProducts(products)
        } else {
          setCategoryProducts([])
          setSubcategories([])
        }
      } catch (error) {
        console.error('Error fetching category products:', error)
        setCategoryProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (categoryName) {
      fetchCategoryProducts()
    }
  }, [categoryName])

  // Sort products
  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price)
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  // Get category title
  const categoryTitle = categoryName || 'Category'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Category Header */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-light text-center">{categoryTitle.toUpperCase()}</h1>
          <p className="text-center text-gray-600 mt-2">
            {categoryProducts.length} items
          </p>
          
          {/* Subcategories */}
          {subcategories.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 text-center mb-4">Shop by Category</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    to={`/subcategory/${subcategory.id}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          
          <div className="flex items-center">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-black focus:border-black"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="py-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
                <div className="space-y-2">
                  {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                    <label key={size} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                      <span className="ml-2 text-sm text-gray-600">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                <div className="space-y-2">
                  {['Black', 'White', 'Gray', 'Navy', 'Beige'].map(color => (
                    <label key={color} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                      <span className="ml-2 text-sm text-gray-600">{color}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                    <span className="ml-2 text-sm text-gray-600">Under $25</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                    <span className="ml-2 text-sm text-gray-600">$25 - $50</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                    <span className="ml-2 text-sm text-gray-600">$50 - $100</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                    <span className="ml-2 text-sm text-gray-600">Over $100</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
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
                        colors={[...new Set(product.variants.map(v => v.color))]}
                        selectedColor={selectedVariants[product.id]?.color}
                        onColorSelect={(color) => handleColorSelect(product.id, color)}
                        size="sm"
                        showLabels={true}
                        maxDisplay={4}
                      />
                      
                      {/* Size Selector */}
                      {selectedVariants[product.id]?.color && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Size:</p>
                          <div className="flex space-x-2">
                            {product.variants
                              .filter(v => v.color === selectedVariants[product.id].color)
                              .map(variant => (
                                <button
                                  key={variant.size}
                                  onClick={() => setSelectedVariants(prev => ({
                                    ...prev,
                                    [product.id]: { ...prev[product.id], size: variant.size }
                                  }))}
                                  className={`px-2 py-1 text-xs border rounded ${
                                    selectedVariants[product.id]?.size === variant.size
                                      ? 'border-gray-800 bg-gray-100'
                                      : 'border-gray-300 hover:border-gray-400'
                                  }`}
                                >
                                  {variant.size}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
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
                      disabled={addingToCart[product.id]}
                      className="w-full py-2 px-4 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {addingToCart[product.id] ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Adding...
                        </div>
                      ) : (
                        'Add to Cart'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h2>
            <p className="text-gray-600">There are no products in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage