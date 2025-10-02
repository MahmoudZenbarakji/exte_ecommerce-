import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProductColorImageManager from '../ProductColorImageManager'

// Mock the API calls
vi.mock('../../../services/api', () => ({
  uploadAPI: {
    uploadProductImage: vi.fn(),
  },
  productsAPI: {
    addMultipleImages: vi.fn(),
    removeImage: vi.fn(),
  },
}))

describe('ProductColorImageManager', () => {
  const mockProduct = {
    id: 'test-product-id',
    name: 'Test Product',
    images: [
      {
        id: 'image-1',
        url: '/uploads/products/red-image-1.jpg',
        color: 'Red',
        isMain: true,
        order: 1,
      },
      {
        id: 'image-2',
        url: '/uploads/products/red-image-2.jpg',
        color: 'Red',
        isMain: false,
        order: 2,
      },
      {
        id: 'image-3',
        url: '/uploads/products/blue-image.jpg',
        color: 'Blue',
        isMain: true,
        order: 1,
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

  const mockOnUpdate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render color management interface', () => {
    render(
      <ProductColorImageManager
        product={mockProduct}
        onUpdate={mockOnUpdate}
      />
    )

    expect(screen.getByText('Color & Image Management')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Add new color (e.g., Red, Blue, Green)')).toBeInTheDocument()
  })

  it('should display available colors from product data', () => {
    render(
      <ProductColorImageManager
        product={mockProduct}
        onUpdate={mockOnUpdate}
      />
    )

    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Blue')).toBeInTheDocument()
  })

  it('should add new color when input is filled and button is clicked', async () => {
    render(
      <ProductColorImageManager
        product={mockProduct}
        onUpdate={mockOnUpdate}
      />
    )

    const colorInput = screen.getByPlaceholderText('Add new color (e.g., Red, Blue, Green)')
    const addButton = screen.getByText('Add Color')

    fireEvent.change(colorInput, { target: { value: 'Green' } })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('Green')).toBeInTheDocument()
    })
  })

  it('should not add duplicate colors', async () => {
    render(
      <ProductColorImageManager
        product={mockProduct}
        onUpdate={mockOnUpdate}
      />
    )

    const colorInput = screen.getByPlaceholderText('Add new color (e.g., Red, Blue, Green)')
    const addButton = screen.getByText('Add Color')

    // Try to add Red again
    fireEvent.change(colorInput, { target: { value: 'Red' } })
    fireEvent.click(addButton)

    // Should not add duplicate
    const redElements = screen.getAllByText('Red')
    expect(redElements).toHaveLength(1) // Only the original one
  })

  it('should remove color when X button is clicked', async () => {
    render(
      <ProductColorImageManager
        product={mockProduct}
        onUpdate={mockOnUpdate}
      />
    )

    // Find the X button for Red color
    const redColorContainer = screen.getByText('Red').closest('div')
    const removeButton = redColorContainer.querySelector('button[title="Remove color"]')
    
    fireEvent.click(removeButton)

    await waitFor(() => {
      expect(screen.queryByText('Red')).not.toBeInTheDocument()
    })
  })

  it('should select color and show its images', async () => {
    render(
      <ProductColorImageManager
        product={mockProduct}
        onUpdate={mockOnUpdate}
      />
    )

    // Click on Red color to select it
    const redColorButton = screen.getByText('Red').closest('div').querySelector('button')
    fireEvent.click(redColorButton)

    await waitFor(() => {
      expect(screen.getByText('Red Images')).toBeInTheDocument()
      expect(screen.getByText('Current Images')).toBeInTheDocument()
    })
  })

  it('should display images for selected color', async () => {
    render(
      <ProductColorImageManager
        product={mockProduct}
        onUpdate={mockOnUpdate}
      />
    )

    // Select Red color
    const redColorButton = screen.getByText('Red').closest('div').querySelector('button')
    fireEvent.click(redColorButton)

    await waitFor(() => {
      // Should show Red images
      const redImages = screen.getAllByAltText(/red product image/i)
      expect(redImages).toHaveLength(2) // 2 Red images
    })
  })

  it('should show main image indicator', async () => {
    render(
      <ProductColorImageManager
        product={mockProduct}
        onUpdate={mockOnUpdate}
      />
    )

    // Select Red color
    const redColorButton = screen.getByText('Red').closest('div').querySelector('button')
    fireEvent.click(redColorButton)

    await waitFor(() => {
      expect(screen.getByText('Main')).toBeInTheDocument()
    })
  })

  it('should handle file upload for selected color', async () => {
    const { uploadAPI, productsAPI } = await import('../../../services/api')
    
    uploadAPI.uploadProductImage.mockResolvedValue({ url: '/uploads/products/new-red-image.jpg' })
    productsAPI.addMultipleImages.mockResolvedValue({ count: 1 })

    render(
      <ProductColorImageManager
        product={mockProduct}
        onUpdate={mockOnUpdate}
      />
    )

    // Select Red color
    const redColorButton = screen.getByText('Red').closest('div').querySelector('button')
    fireEvent.click(redColorButton)

    await waitFor(() => {
      // Create a mock file
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const fileInput = screen.getByLabelText(/Click to upload images for Red/i)
      
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    await waitFor(() => {
      expect(uploadAPI.uploadProductImage).toHaveBeenCalled()
      expect(productsAPI.addMultipleImages).toHaveBeenCalledWith('test-product-id', [
        expect.objectContaining({
          url: '/uploads/products/new-red-image.jpg',
          color: 'Red',
          isMain: true,
          order: 1,
        }),
      ])
      expect(mockOnUpdate).toHaveBeenCalled()
    })
  })

  it('should handle multiple file upload', async () => {
    const { uploadAPI, productsAPI } = await import('../../../services/api')
    
    uploadAPI.uploadProductImage
      .mockResolvedValueOnce({ url: '/uploads/products/red-1.jpg' })
      .mockResolvedValueOnce({ url: '/uploads/products/red-2.jpg' })
    productsAPI.addMultipleImages.mockResolvedValue({ count: 2 })

    render(
      <ProductColorImageManager
        product={mockProduct}
        onUpdate={mockOnUpdate}
      />
    )

    // Select Red color
    const redColorButton = screen.getByText('Red').closest('div').querySelector('button')
    fireEvent.click(redColorButton)

    await waitFor(() => {
      // Create mock files
      const file1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' })
      const file2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
      const fileInput = screen.getByLabelText(/Click to upload images for Red/i)
      
      fireEvent.change(fileInput, { target: { files: [file1, file2] } })
    })

    await waitFor(() => {
      expect(uploadAPI.uploadProductImage).toHaveBeenCalledTimes(2)
      expect(productsAPI.addMultipleImages).toHaveBeenCalledWith('test-product-id', [
        expect.objectContaining({
          url: '/uploads/products/red-1.jpg',
          color: 'Red',
          isMain: true,
          order: 1,
        }),
        expect.objectContaining({
          url: '/uploads/products/red-2.jpg',
          color: 'Red',
          isMain: false,
          order: 2,
        }),
      ])
    })
  })

  it('should remove image when delete button is clicked', async () => {
    const { productsAPI } = await import('../../../services/api')
    productsAPI.removeImage.mockResolvedValue({ id: 'image-1' })

    render(
      <ProductColorImageManager
        product={mockProduct}
        onUpdate={mockOnUpdate}
      />
    )

    // Select Red color
    const redColorButton = screen.getByText('Red').closest('div').querySelector('button')
    fireEvent.click(redColorButton)

    await waitFor(() => {
      // Hover over an image to show delete button
      const imageContainer = screen.getAllByAltText(/red product image/i)[0].closest('div')
      fireEvent.mouseEnter(imageContainer)
      
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)
    })

    await waitFor(() => {
      expect(productsAPI.removeImage).toHaveBeenCalledWith('test-product-id', 'image-1')
      expect(mockOnUpdate).toHaveBeenCalled()
    })
  })

  it('should show loading state during upload', async () => {
    const { uploadAPI } = await import('../../../services/api')
    
    // Mock a slow upload
    uploadAPI.uploadProductImage.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ url: '/test.jpg' }), 100))
    )

    render(
      <ProductColorImageManager
        product={mockProduct}
        onUpdate={mockOnUpdate}
      />
    )

    // Select Red color
    const redColorButton = screen.getByText('Red').closest('div').querySelector('button')
    fireEvent.click(redColorButton)

    await waitFor(() => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const fileInput = screen.getByLabelText(/Click to upload images for Red/i)
      
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    // Should show loading state
    expect(screen.getByText('Uploading images...')).toBeInTheDocument()
  })

  it('should handle upload errors gracefully', async () => {
    const { uploadAPI } = await import('../../../services/api')
    uploadAPI.uploadProductImage.mockRejectedValue(new Error('Upload failed'))

    // Mock window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <ProductColorImageManager
        product={mockProduct}
        onUpdate={mockOnUpdate}
      />
    )

    // Select Red color
    const redColorButton = screen.getByText('Red').closest('div').querySelector('button')
    fireEvent.click(redColorButton)

    await waitFor(() => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const fileInput = screen.getByLabelText(/Click to upload images for Red/i)
      
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error uploading images. Please try again.')
    })

    alertSpy.mockRestore()
  })

  it('should show message when no images exist for a color', async () => {
    const productWithoutImages = {
      ...mockProduct,
      images: [],
    }

    render(
      <ProductColorImageManager
        product={productWithoutImages}
        onUpdate={mockOnUpdate}
      />
    )

    // Select Red color
    const redColorButton = screen.getByText('Red').closest('div').querySelector('button')
    fireEvent.click(redColorButton)

    await waitFor(() => {
      expect(screen.getByText('No images uploaded for Red yet')).toBeInTheDocument()
    })
  })
})



































