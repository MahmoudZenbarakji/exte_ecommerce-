import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import{Button} from './components/ui/button'
import { Input } from '@headlessui/react'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { categoriesAPI, subcategoriesAPI, uploadAPI } from '../services/api'
import { useCategories } from '../contexts.jsx'


import { Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,

 } from './components/ui/dialog'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedCategories, setExpandedCategories] = useState(new Set([1, 2, 3]))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState('category') // 'category' or 'subcategory'
  const [editingItem, setEditingItem] = useState(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
    categoryId: ''
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  
  // Get categories context to refresh sidebar
  const { refreshCategories } = useCategories()

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await categoriesAPI.getAll()
      setCategories(data)
      setError('')
    } catch (err) {
      setError('Failed to fetch categories')
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Prevent multiple submissions
    if (uploading) {
      console.log('Upload in progress, ignoring submission')
      return
    }
    
    try {
      // Check authentication before making API calls
      const token = localStorage.getItem('access_token')
      const user = localStorage.getItem('user')
      
      console.log('Token exists:', !!token)
      console.log('User exists:', !!user)
      console.log('Form data:', formData)
      
      if (!token) {
        setError('No authentication token found. Please login again.')
        return
      }
      
      if (dialogType === 'category') {
        let categoryData = { ...formData }
        // Remove categoryId from category data as it's not needed for categories
        delete categoryData.categoryId
        console.log('Initial category data:', categoryData)
        
        // Upload image if a new file is selected
        if (selectedFile) {
          console.log('Uploading image...', selectedFile.name)
          const imageUrl = await uploadImage(selectedFile)
          console.log('Image uploaded successfully, URL:', imageUrl)
          categoryData.image = imageUrl
          console.log('Category data after image upload:', categoryData)
        } else {
          // If no new file is selected, keep the existing image or set to null
          categoryData.image = formData.image || null
          console.log('No new file selected, using existing image:', categoryData.image)
        }
        
        if (editingItem) {
          // Update existing category
          console.log('Updating category:', editingItem.id)
          await categoriesAPI.update(editingItem.id, categoryData)
        } else {
          // Add new category
          console.log('Creating new category with data:', categoryData)
          const result = await categoriesAPI.create(categoryData)
          console.log('Category created successfully:', result)
        }
      } else {
        // Handle subcategory creation/update
        const subcategoryData = {
          name: formData.name,
          description: formData.description,
          image: formData.image,
          isActive: formData.isActive,
          categoryId: selectedCategoryId
        }

        if (editingItem) {
          // Update existing subcategory
          console.log('Updating subcategory:', editingItem.id)
          await subcategoriesAPI.update(editingItem.id, subcategoryData)
        } else {
          // Create new subcategory
          console.log('Creating new subcategory')
          await subcategoriesAPI.create(subcategoryData)
        }
      }
      
      // Refresh categories after successful operation
      await fetchCategories()
      // Also refresh the sidebar categories
      refreshCategories()
      setIsDialogOpen(false)
      resetForm()
    } catch (err) {
      setError(err.message || 'Failed to save category')
      console.error('Error saving category:', err)
    }
  }

  const handleEditCategory = (category) => {
    setDialogType('category')
    setEditingItem(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive,
      categoryId: ''
    })
    setImagePreview(category.image || null)
    setSelectedFile(null)
    setIsDialogOpen(true)
  }

  const handleEditSubcategory = (subcategory, categoryId) => {
    setDialogType('subcategory')
    setEditingItem(subcategory)
    setSelectedCategoryId(categoryId)
    setFormData({
      name: subcategory.name,
      description: subcategory.description || '',
      image: subcategory.image || '',
      isActive: subcategory.isActive,
      categoryId: categoryId
    })
    setImagePreview(subcategory.image || null)
    setSelectedFile(null)
    setIsDialogOpen(true)
  }

  const handleAddSubcategory = (categoryId) => {
    setDialogType('subcategory')
    setSelectedCategoryId(categoryId)
    setFormData({
      name: '',
      description: '',
      image: '',
      isActive: true,
      categoryId: categoryId
    })
    setImagePreview(null)
    setSelectedFile(null)
    setIsDialogOpen(true)
  }

  const handleDeleteSubcategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await subcategoriesAPI.delete(id)
        await fetchCategories()
        refreshCategories()
      } catch (err) {
        setError(err.message || 'Failed to delete subcategory')
        console.error('Error deleting subcategory:', err)
      }
    }
  }

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        // Check authentication before making API calls
        const token = localStorage.getItem('access_token')
        console.log('Delete - Token exists:', !!token)
        
        if (!token) {
          setError('No authentication token found. Please login again.')
          return
        }
        
        console.log('Deleting category:', id)
        await categoriesAPI.delete(id)
        await fetchCategories() // Refresh the list
      } catch (err) {
        setError(err.message || 'Failed to delete category')
        console.error('Error deleting category:', err)
      }
    }
  }


  const resetForm = () => {
    setEditingItem(null)
    setSelectedCategoryId(null)
    setFormData({ name: '', description: '', image: '', isActive: true, categoryId: '' })
    setSelectedFile(null)
    setImagePreview(null)
  }

  // Image upload handlers
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      
      // Update form data to indicate a file has been selected
      setFormData(prev => ({ ...prev, image: 'file_selected' }))
    }
  }

  const uploadImage = async (file) => {
    try {
      setUploading(true)
      console.log('Starting image upload for file:', file.name, 'Size:', file.size)
      const response = await uploadAPI.uploadCategoryImage(file)
      console.log('Upload response:', response)
      return response.url
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading categories...</div>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Categories & Subcategories</h1>
          <p className="mt-2 text-sm text-gray-700">
            Organize your products with categories and subcategories.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setDialogType('category'); resetForm(); }}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingItem 
                    ? `Edit ${dialogType === 'category' ? 'Category' : 'Subcategory'}`
                    : `Add New ${dialogType === 'category' ? 'Category' : 'Subcategory'}`
                  }
                </DialogTitle>
                <DialogDescription>
                  {editingItem 
                    ? `Update the ${dialogType} details below.`
                    : `Create a new ${dialogType} to organize your products.`
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">{dialogType === 'category' ? 'Category' : 'Subcategory'} Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={`Enter ${dialogType} name`}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder={`Enter ${dialogType} description`}
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Category Image</Label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                        <p className="text-xs text-gray-500 mt-1">Image preview</p>
                      </div>
                    )}
                    {uploading && (
                      <div className="text-sm text-blue-600">Uploading image...</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="isActive">Status</Label>
                    <select
                      id="isActive"
                      value={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={uploading}>
                    {uploading 
                      ? 'Uploading...' 
                      : editingItem 
                        ? `Update ${dialogType === 'category' ? 'Category' : 'Subcategory'}`
                        : `Create ${dialogType === 'category' ? 'Category' : 'Subcategory'}`
                    }
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {categories.map((category) => (
              <li key={category.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="mr-2 p-1 rounded-full hover:bg-gray-100"
                      >
                        {expandedCategories.has(category.id) ? (
                          <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4" />
                        )}
                      </button>
                      <div>
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600">{category.name}</p>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            category.isActive 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSubcategory(category.id)}
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Sub
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {expandedCategories.has(category.id) && category.subcategories.length > 0 && (
                    <div className="mt-4 ml-6">
                      <div className="space-y-2">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900">{subcategory.name}</p>
                                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  subcategory.isActive 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {subcategory.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">{subcategory.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditSubcategory(subcategory, category.id)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteSubcategory(subcategory.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

