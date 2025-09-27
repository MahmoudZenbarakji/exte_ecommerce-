import { memo } from 'react'

const SaleBadge = memo(function SaleBadge({ 
  product, 
  size = 'default',
  className = '',
  showDiscount = true 
}) {
  if (!product?.isOnSale || !product?.salePrice) {
    return null
  }

  const originalPrice = product.price
  const salePrice = product.salePrice
  const discountPercentage = Math.round(((originalPrice - salePrice) / originalPrice) * 100)

  // Size variants
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    default: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    default: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <div className={`inline-flex items-center gap-1 bg-red-500 text-white rounded-full font-semibold shadow-lg ${sizeClasses[size]} ${className}`}>
      <span className={iconSizes[size]}>🔥</span>
      {product.saleBadge || 'Sale'}
      {showDiscount && discountPercentage > 0 && (
        <span className="ml-1 bg-red-600 px-1.5 py-0.5 rounded-full text-xs">
          -{discountPercentage}%
        </span>
      )}
    </div>
  )
})

export default SaleBadge
