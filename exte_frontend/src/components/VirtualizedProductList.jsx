import React, { memo, useMemo, useCallback } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import { useProducts } from '../hooks/useProducts'
import OptimizedProductCardV2 from './OptimizedProductCardV2'

// Memoized product item component
const ProductItem = memo(({ columnIndex, rowIndex, style, data }) => {
  const { products, onImageClick, onQuickView, selectedColors, onColorChange } = data
  const productIndex = rowIndex * 4 + columnIndex // Assuming 4 columns
  const product = products[productIndex]

  if (!product) {
    return <div style={style} />
  }

  return (
    <div style={style} className="p-2">
      <OptimizedProductCardV2
        product={product}
        onImageClick={onImageClick}
        onQuickView={onQuickView}
        selectedColor={selectedColors[product.id]}
        onColorChange={onColorChange}
        className="h-full"
      />
    </div>
  )
})

// Virtualized product list component
const VirtualizedProductList = memo(function VirtualizedProductList({
  filters = {},
  onImageClick,
  onQuickView,
  selectedColors = {},
  onColorChange,
  className = '',
  itemHeight = 400,
  columnCount = 4,
}) {
  const { data, isLoading, error } = useProducts(filters)

  // Memoized data for the grid
  const gridData = useMemo(() => ({
    products: data?.products || [],
    onImageClick,
    onQuickView,
    selectedColors,
    onColorChange,
  }), [data?.products, onImageClick, onQuickView, selectedColors, onColorChange])

  // Calculate grid dimensions
  const rowCount = Math.ceil((data?.products?.length || 0) / columnCount)
  const containerHeight = Math.min(rowCount * itemHeight, 800) // Max height of 800px

  const handleImageClick = useCallback((product) => {
    if (onImageClick) {
      onImageClick(product)
    }
  }, [onImageClick])

  const handleQuickView = useCallback((product) => {
    if (onQuickView) {
      onQuickView(product)
    }
  }, [onQuickView])

  const handleColorChange = useCallback((productId, color) => {
    if (onColorChange) {
      onColorChange(productId, color)
    }
  }, [onColorChange])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">Error loading products: {error.message}</p>
      </div>
    )
  }

  if (!data?.products?.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No products found</p>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      <Grid
        columnCount={columnCount}
        columnWidth={300}
        height={containerHeight}
        rowCount={rowCount}
        rowHeight={itemHeight}
        itemData={gridData}
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {ProductItem}
      </Grid>
    </div>
  )
})

export default VirtualizedProductList