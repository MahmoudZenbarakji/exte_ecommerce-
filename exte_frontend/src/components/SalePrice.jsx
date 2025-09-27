import { memo } from 'react'

const SalePrice = memo(function SalePrice({ 
  product, 
  size = 'default',
  className = '',
  showOriginalPrice = true,
  currency = 'SYP'
}) {
  if (!product?.isOnSale || !product?.salePrice) {
    return (
      <span className={`font-bold text-gray-900 ${className}`}>
        {currency} {product?.price || 0}
      </span>
    )
  }

  const originalPrice = product.price
  const salePrice = product.salePrice
  const discountPercentage = Math.round(((originalPrice - salePrice) / originalPrice) * 100)

  // Size variants
  const sizeClasses = {
    sm: 'text-sm',
    default: 'text-lg',
    lg: 'text-xl'
  }

  const originalSizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`font-bold text-red-600 ${sizeClasses[size]}`}>
        {currency} {salePrice}
      </span>
      {showOriginalPrice && (
        <span className={`text-gray-500 line-through ${originalSizeClasses[size]}`}>
          {currency} {originalPrice}
        </span>
      )}
      {discountPercentage > 0 && (
        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
          -{discountPercentage}% off
        </span>
      )}
    </div>
  )
})

export default SalePrice
