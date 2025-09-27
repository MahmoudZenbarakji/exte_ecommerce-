import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { collectionsAPI, uploadAPI } from '../services/api'

import { Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger, } from './components/ui/dialog'

export default function Collections() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  })

  // Fetch collections on component mount
  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const data = await collectionsAPI.getAll()
      setCollections(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch collections')
      console.error('Error fetching collections:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      let collectionData = { ...formData }
      console.log('Initial form data:', formData)
      
      // Handle image upload
      if (selectedFile) {
        console.log('Uploading collection image...', selectedFile.name)
        setUploading(true)
        const imageResponse = await uploadAPI.uploadCollectionImage(selectedFile)
        
        if (!imageResponse || !imageResponse.url) {
          throw new Error('Failed to upload image')
        }
        
        console.log('Collection image uploaded successfully, URL:', imageResponse.url)
        collectionData.image = imageResponse.url
        setUploading(false)
      } else if (editingCollection && !selectedFile) {
        // Keep existing image if no new file is selected
        collectionData.image = editingCollection.image || ''
      } else {
        // No image provided for new collection - remove the image field entirely
        delete collectionData.image
      }
      
      // Remove empty optional fields
      if (!collectionData.description) delete collectionData.description
      
      console.log('Sending collection data:', collectionData)
      
      if (editingCollection) {
        // Update existing collection
        await collectionsAPI.update(editingCollection.id, collectionData)
      } else {
        // Add new collection
        await collectionsAPI.create(collectionData)
      }
      
      // Refresh collections list
      await fetchCollections()
      setIsDialogOpen(false)
      resetForm()
    } catch (err) {
      setError(err.message || 'Failed to save collection')
      console.error('Error saving collection:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (collection) => {
    setEditingCollection(collection)
    setFormData({
      name: collection.name,
      description: collection.description || '',
      isActive: collection.isActive
    })
    setSelectedFile(null)
    setImagePreview(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await collectionsAPI.delete(id)
        await fetchCollections()
      } catch (err) {
        setError(err.message || 'Failed to delete collection')
        console.error('Error deleting collection:', err)
      }
    }
  }

  const resetForm = () => {
    setEditingCollection(null)
    setFormData({ name: '', description: '', isActive: true })
    setSelectedFile(null)
    setImagePreview(null)
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your product collections and organize your inventory.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingCollection ? 'Edit Collection' : 'Add New Collection'}
                </DialogTitle>
                <DialogDescription>
                  {editingCollection 
                    ? 'Update the collection details below.'
                    : 'Create a new collection to organize your products.'
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Collection Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter collection name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter collection description"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="isActive">Status</Label>
                    <select
                      id="isActive"
                      value={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="image">
                      {editingCollection ? 'Replace Collection Image' : 'Collection Image'}
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {editingCollection && !selectedFile && editingCollection.image && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Current image:</p>
                        <img
                          src={editingCollection.image.startsWith('http') 
                            ? editingCollection.image 
                            : `http://localhost:3000${editingCollection.image}`}
                          alt="Current collection"
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                    {imagePreview && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : (editingCollection ? 'Update Collection' : 'Create Collection')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="mt-8 flow-root">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading collections...</div>
          </div>
        ) : (
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Collection
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {collections.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No collections found. Create your first collection to get started.
                        </td>
                      </tr>
                    ) : (
                      collections.map((collection) => (
                        <tr key={collection.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              {collection.image && (
                                <img
                                  src={collection.image.startsWith('http') 
                                    ? collection.image 
                                    : `http://localhost:3000${collection.image}`}
                                  alt={collection.name}
                                  className="w-12 h-12 object-cover rounded-md border"
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">{collection.name}</div>
                                <div className="text-sm text-gray-500">{collection.description || 'No description'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              collection.isActive 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {collection.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {collection.products ? collection.products.length : 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(collection.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(collection)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(collection.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

