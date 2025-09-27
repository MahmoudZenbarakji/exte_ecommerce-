import React, { memo, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { Button } from './ui/button'
import OptimizedImage from './OptimizedImage'
import FavoriteIcon from './FavoriteIcon'
import SaleBadge from './SaleBadge'
import SalePrice from './SalePrice'
import ColorPicker from './ColorPicker'
import { useCart } from '../hooks/useCart'
import { useFavorites } from '../contexts'

// Memoized components for better performance
const ProductImage = memo(({ product, onImageClick }) => (
  <div className="relative overflow-hidden">
    <OptimizedImage
      src={product.images?.[0]?.url}
      alt={product.name}
      className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
      onClick={onImageClick}
    />
    {/* Sale Badge */}
    <div className="absolute top-2 left-2 z-20">
      <SaleBadge product={product} size="default" />
    </div>
    {/* Favorite button */}
    <div className="absolute top-2 right-2 z-20">
      <FavoriteIcon
        productId={product.id}
        size="default"
        className="hover:scale-110 transition-transform duration-200"
      />
    </div>
  </div>
))

const ProductActions = memo(({ product, onAddToCart, onQuickView }) => (
  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={onAddToCart}
        className="bg-white text-black hover:bg-gray-100"
      >
        <ShoppingCart className="h-4 w-4 mr-1" />
        Add to Cart
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onQuickView}
        className="bg-white text-black hover:bg-gray-100"
      >
        <Eye className="h-4 w-4 mr-1" />
        Quick View
      </Button>
    </div>
  </div>
))

const ProductInfo = memo(({ product, onColorChange, selectedColor }) => (
  <div className="p-4">
    <Link to={`/product/${product.id}`}>
      <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-600 transition-colors line-clamp-2">
        {product.name}
      </h3>
    </Link>
    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
      {product.description}
    </p>
    <div className="mb-4">
      <SalePrice product={product} size="default" />
    </div>
    
    {/* Color Picker */}
    {product.variants && product.variants.length > 0 && (
      <ColorPicker
        variants={product.variants}
        selectedColor={selectedColor}
        onColorChange={onColorChange}
        productId={product.id}
      />
    )}
  </div>
))

// Main optimized product card component
const OptimizedProductCardV2 = memo(function OptimizedProductCardV2({
  product,
  onImageClick,
  onQuickView,
  selectedColor,
  onColorChange,
  className = '',
}) {
  const { addToCart } = useCart()
  const { isFavorite } = useFavorites()

  // Memoized handlers to prevent unnecessary re-renders
  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity: 1,
        color: selectedColor || product.variants?.[0]?.color,
        size: product.variants?.[0]?.size,
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }, [addToCart, product.id, selectedColor, product.variants])

  const handleImageClick = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onImageClick) {
      onImageClick(product)
    }
  }, [onImageClick, product])

  const handleQuickView = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onQuickView) {
      onQuickView(product)
    }
  }, [onQuickView, product])

  const handleColorChange = useCallback((color) => {
    if (onColorChange) {
      onColorChange(product.id, color)
    }
  }, [onColorChange, product.id])

  // Memoized product data to prevent unnecessary recalculations
  const productData = useMemo(() => ({
    id: product.id,
    name: product.name,
    description: product.description,
    images: product.images,
    variants: product.variants,
    price: product.price,
    isOnSale: product.isOnSale,
    salePrice: product.salePrice,
    saleBadge: product.saleBadge,
  }), [product])

  return (
    <div className={`group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      <div className="relative">
        <ProductImage 
          product={productData} 
          onImageClick={handleImageClick}
        />
        <ProductActions 
          product={productData}
          onAddToCart={handleAddToCart}
          onQuickView={handleQuickView}
        />
      </div>
      
      <ProductInfo 
        product={productData}
        onColorChange={handleColorChange}
        selectedColor={selectedColor}
      />
    </div>
  )
})

export default OptimizedProductCardV2
