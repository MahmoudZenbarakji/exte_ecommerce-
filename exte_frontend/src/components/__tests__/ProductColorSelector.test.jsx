import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProductColorSelector from '../ProductColorSelector'

// Mock the API calls
vi.mock('../../services/api', () => ({
  productsAPI: {
    getById: vi.fn(),
    getAvailableColors: vi.fn(),
    getImagesByColor: vi.fn(),
  },
}))

describe('ProductColorSelector', () => {
  const mockProduct = {
    id: 'test-product-id',
    name: 'Test Product',
    images: [
      {
        id: 'image-1',
        url: '/uploads/products/red-image.jpg',
        color: 'Red',
        isMain: true,
        order: 1,
      },
      {
        id: 'image-2',
        url: '/uploads/products/blue-image.jpg',
        color: 'Blue',
        isMain: false,
        order: 2,
      },
      {
        id: 'image-3',
        url: '/uploads/products/red-image-2.jpg',
        color: 'Red',
        isMain: false,
        order: 3,
      },
    ],
    variants: [
      {
        id: 'variant-1',
        size: 'M',
        color: 'Red',
        stock: 25,
      },
      {
        id: 'variant-2',
        size: 'L',
        color: 'Blue',
        stock: 25,
      },
    ],
  }

  const mockOnColorChange = vi.fn()
  const mockOnImageChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render color selector with available colors', () => {
    render(
      <ProductColorSelector
        product={mockProduct}
        onColorChange={mockOnColorChange}
        onImageChange={mockOnImageChange}
      />
    )

    // Check if color swatches are rendered
    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Blue')).toBeInTheDocument()
  })

  it('should display main image for selected color', () => {
    render(
      <ProductColorSelector
        product={mockProduct}
        onColorChange={mockOnColorChange}
        onImageChange={mockOnImageChange}
      />
    )

    // Check if main image is displayed
    const mainImage = screen.getByAltText('Test Product - Red')
    expect(mainImage).toBeInTheDocument()
    expect(mainImage).toHaveAttribute('src', 'http://localhost:3000/uploads/products/red-image.jpg')
  })

  it('should show image thumbnails when multiple images exist for a color', () => {
    render(
      <ProductColorSelector
        product={mockProduct}
        onColorChange={mockOnColorChange}
        onImageChange={mockOnImageChange}
      />
    )

    // Should show thumbnails for Red color (2 images)
    const thumbnails = screen.getAllByAltText(/Test Product \d+/)
    expect(thumbnails).toHaveLength(2) // 2 images for Red color
  })

  it('should handle color selection and update images', async () => {
    render(
      <ProductColorSelector
        product={mockProduct}
        onColorChange={mockOnColorChange}
        onImageChange={mockOnImageChange}
      />
    )

    // Click on Blue color
    const blueColorButton = screen.getByTitle('Blue')
    fireEvent.click(blueColorButton)

    await waitFor(() => {
      expect(mockOnColorChange).toHaveBeenCalledWith('Blue')
      expect(mockOnImageChange).toHaveBeenCalledWith([
        expect.objectContaining({
          color: 'Blue',
        }),
      ])
    })

    // Check if Blue image is now displayed
    const blueImage = screen.getByAltText('Test Product - Blue')
    expect(blueImage).toBeInTheDocument()
  })

  it('should handle image thumbnail selection', async () => {
    render(
      <ProductColorSelector
        product={mockProduct}
        onColorChange={mockOnColorChange}
        onImageChange={mockOnImageChange}
      />
    )

    // Click on second thumbnail
    const thumbnails = screen.getAllByAltText(/Test Product \d+/)
    fireEvent.click(thumbnails[1])

    // Check if the second image is now the main image
    const mainImage = screen.getByAltText('Test Product - Red')
    expect(mainImage).toHaveAttribute('src', 'http://localhost:3000/uploads/products/red-image-2.jpg')
  })

  it('should display color hex values correctly', () => {
    render(
      <ProductColorSelector
        product={mockProduct}
        onColorChange={mockOnColorChange}
        onImageChange={mockOnImageChange}
      />
    )

    // Check if color swatches have correct background colors
    const redSwatch = screen.getByTitle('Red')
    const blueSwatch = screen.getByTitle('Blue')

    expect(redSwatch.querySelector('div')).toHaveStyle('background-color: #ef4444')
    expect(blueSwatch.querySelector('div')).toHaveStyle('background-color: #3b82f6')
  })

  it('should show selected color indicator', () => {
    render(
      <ProductColorSelector
        product={mockProduct}
        onColorChange={mockOnColorChange}
        onImageChange={mockOnImageChange}
      />
    )

    // Red should be selected by default (first color)
    const redSwatch = screen.getByTitle('Red')
    expect(redSwatch).toHaveClass('border-gray-800')
  })

  it('should handle products without color-specific images', () => {
    const productWithoutColors = {
      ...mockProduct,
      images: [
        {
          id: 'image-1',
          url: '/uploads/products/generic-image.jpg',
          color: null,
          isMain: true,
          order: 1,
        },
      ],
      variants: [],
    }

    render(
      <ProductColorSelector
        product={productWithoutColors}
        onColorChange={mockOnColorChange}
        onImageChange={mockOnImageChange}
      />
    )

    // Should not render color selector
    expect(screen.queryByText('Color')).not.toBeInTheDocument()
  })

  it('should handle products with only variants (no image colors)', () => {
    const productWithVariantsOnly = {
      ...mockProduct,
      images: [
        {
          id: 'image-1',
          url: '/uploads/products/generic-image.jpg',
          color: null,
          isMain: true,
          order: 1,
        },
      ],
    }

    render(
      <ProductColorSelector
        product={productWithVariantsOnly}
        onColorChange={mockOnColorChange}
        onImageChange={mockOnImageChange}
      />
    )

    // Should show colors from variants
    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Blue')).toBeInTheDocument()
  })

  it('should call onColorChange and onImageChange on mount', async () => {
    render(
      <ProductColorSelector
        product={mockProduct}
        onColorChange={mockOnColorChange}
        onImageChange={mockOnImageChange}
      />
    )

    await waitFor(() => {
      expect(mockOnColorChange).toHaveBeenCalledWith('Red')
      expect(mockOnImageChange).toHaveBeenCalledWith([
        expect.objectContaining({ color: 'Red' }),
        expect.objectContaining({ color: 'Red' }),
      ])
    })
  })

  it('should handle unknown colors gracefully', () => {
    const productWithUnknownColor = {
      ...mockProduct,
      variants: [
        {
          id: 'variant-1',
          size: 'M',
          color: 'UnknownColor',
          stock: 25,
        },
      ],
    }

    render(
      <ProductColorSelector
        product={productWithUnknownColor}
        onColorChange={mockOnColorChange}
        onImageChange={mockOnImageChange}
      />
    )

    // Should render the unknown color
    expect(screen.getByText('UnknownColor')).toBeInTheDocument()
    
    // Should use default gray color for unknown colors
    const unknownColorSwatch = screen.getByTitle('UnknownColor')
    expect(unknownColorSwatch.querySelector('div')).toHaveStyle('background-color: #6b7280')
  })
})


























