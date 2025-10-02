import { useState } from 'react'
import { Plus as PlusIcon, Pencil as PencilIcon, Trash2 as TrashIcon, Image as PhotoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.jsx'

// Mock data for products
const initialProducts = [
  {
    id: 1,
    name: 'Summer Dress',
    description: 'Light and comfortable summer dress',
    price: 89.95,
    currency: 'SYP',
    category: 'Women',
    subcategory: 'Dresses',
    collection: 'Summer Collection 2024',
    status: 'Active',
    stock: 25,
    colors: ['Red', 'Blue', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Cotton Shirt',
    description: 'Classic cotton shirt for men',
    price: 45.99,
    currency: 'SYP',
    category: 'Men',
    subcategory: 'Shirts',
    collection: 'Spring Arrivals',
    status: 'Active',
    stock: 40,
    colors: ['White', 'Blue', 'Gray'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop',
    createdAt: '2024-01-12'
  },
  {
    id: 3,
    name: 'Kids T-Shirt',
    description: 'Colorful t-shirt for children',
    price: 25.50,
    currency: 'SYP',
    category: 'Kids',
    subcategory: 'Boys',
    collection: 'Kids Collection',
    status: 'Draft',
    stock: 15,
    colors: ['Yellow', 'Green', 'Orange'],
    sizes: ['XS', 'S', 'M'],
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=300&h=400&fit=crop',
    createdAt: '2024-01-10'
  }
]

const categories = ['Women', 'Men', 'Kids', 'Home']
const collections = ['Summer Collection 2024', 'Winter Essentials', 'Spring Arrivals', 'Kids Collection']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const colors = ['Red', 'Blue', 'White', 'Black', 'Gray', 'Green', 'Yellow', 'Orange', 'Pink', 'Purple']

export default function Products() {
  const [products, setProducts] = useState(initialProducts)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    collection: '',
    status: 'Active',
    stock: '',
    colors: [],
    sizes: [],
    image: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === editingProduct.id 
          ? { ...product, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) }
          : product
      ))
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        currency: 'SYP',
        createdAt: new Date().toISOString().split('T')[0]
      }
      setProducts([...products, newProduct])
    }
    
    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      subcategory: product.subcategory,
      collection: product.collection,
      status: product.status,
      stock: product.stock.toString(),
      colors: product.colors,
      sizes: product.sizes,
      image: product.image
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setProducts(products.filter(product => product.id !== id))
  }

  const handleColorChange = (color) => {
    const newColors = formData.colors.includes(color)
      ? formData.colors.filter(c => c !== color)
      : [...formData.colors, color]
    setFormData({...formData, colors: newColors})
  }

  const handleSizeChange = (size) => {
    const newSizes = formData.sizes.includes(size)
      ? formData.sizes.filter(s => s !== size)
      : [...formData.sizes, size]
    setFormData({...formData, sizes: newSizes})
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      subcategory: '',
      collection: '',
      status: 'Active',
      stock: '',
      colors: [],
      sizes: [],
      image: ''
    })
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your product inventory, pricing, and details.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct 
                    ? 'Update the product details below.'
                    : 'Create a new product for your store.'
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price (SYP)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="collection">Collection</Label>
                      <select
                        id="collection"
                        value={formData.collection}
                        onChange={(e) => setFormData({...formData, collection: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select collection</option>
                        {collections.map(collection => (
                          <option key={collection} value={collection}>{collection}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Available Colors</Label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map(color => (
                        <label key={color} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.colors.includes(color)}
                            onChange={() => handleColorChange(color)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm">{color}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Available Sizes</Label>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map(size => (
                        <label key={size} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.sizes.includes(size)}
                            onChange={() => handleSizeChange(size)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="aspect-w-3 aspect-h-4">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <PhotoIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  product.status === 'Active' 
                    ? 'bg-green-100 text-green-800'
                    : product.status === 'Draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
              <div className="mt-2">
                <p className="text-lg font-semibold text-gray-900">{product.currency} {product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">{product.category} • {product.collection}</p>
              </div>
              <div className="mt-3 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}