import { useState } from 'react'

const ColorPicker = ({ 
  colors = [], 
  selectedColor = '', 
  onColorSelect = () => {}, 
  size = 'sm',
  showLabels = false,
  maxDisplay = 4 
}) => {
  // Helper function to get color hex value
  const getColorHex = (colorName) => {
    const colorMap = {
      'black': '#000000',
      'white': '#ffffff',
      'red': '#ef4444',
      'blue': '#3b82f6',
      'green': '#10b981',
      'yellow': '#f59e0b',
      'pink': '#ec4899',
      'purple': '#8b5cf6',
      'gray': '#6b7280',
      'brown': '#92400e',
      'navy': '#1e3a8a',
      'beige': '#f5f5dc',
      'cream': '#f5f5dc',
      'light blue': '#93c5fd',
      'orange': '#f97316'
    }
    return colorMap[colorName.toLowerCase()] || '#6b7280'
  }

  // Helper function to get contrast color for text
  const getContrastColor = (hexColor) => {
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000
    return brightness > 128 ? '#000000' : '#ffffff'
  }

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  }

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm',
    xl: 'text-base'
  }

  if (!colors || colors.length === 0) {
    return null
  }

  const displayColors = colors.slice(0, maxDisplay)
  const remainingCount = colors.length - maxDisplay

  return (
    <div className="flex flex-col space-y-2">
      {showLabels && (
        <p className="text-xs text-gray-500">Available colors:</p>
      )}
      <div className="flex items-center space-x-2">
        {displayColors.map((color) => {
          const isSelected = selectedColor === color
          const colorHex = getColorHex(color)
          const textColor = getContrastColor(colorHex)
          
          return (
            <button
              key={color}
              onClick={() => onColorSelect(color)}
              className={`relative rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ${
                isSelected ? 'border-gray-800 ring-2 ring-gray-300' : 'border-gray-300'
              } ${sizeClasses[size]}`}
              title={color}
            >
              <span className="sr-only">{color}</span>
              <div
                className={`w-full h-full rounded-full flex items-center justify-center ${textSizeClasses[size]} font-medium`}
                style={{ 
                  backgroundColor: colorHex,
                  color: textColor
                }}
              >
                {size === 'xs' || size === 'sm' ? color.charAt(0).toUpperCase() : color}
              </div>
            </button>
          )
        })}
        {remainingCount > 0 && (
          <span className={`text-gray-400 ${textSizeClasses[size]}`}>
            +{remainingCount}
          </span>
        )}
      </div>
    </div>
  )
}

export default ColorPicker



































