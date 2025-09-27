import { useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, PercentBadgeIcon } from '@heroicons/react/24/outline'
import { Button } from './components/ui/button'
import {Input} from './components/ui/input'
import{Textarea} from"./components/ui/textarea"
import {Label} from './components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog'

// Mock data for sales
const initialSales = [
  {
    id: 1,
    name: 'Summer Sale 2024',
    description: 'Big summer discounts on all summer collection items',
    discountType: 'percentage',
    discountValue: 25,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 'Active',
    applicableProducts: ['Summer Collection 2024'],
    applicableCategories: ['Women', 'Men'],
    minOrderAmount: 100,
    maxDiscountAmount: 500,
    createdAt: '2024-05-15'
  },
  {
    id: 2,
    name: 'New Customer Discount',
    description: 'Welcome discount for new customers',
    discountType: 'percentage',
    discountValue: 15,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'Active',
    applicableProducts: [],
    applicableCategories: [],
    minOrderAmount: 50,
    maxDiscountAmount: 200,
    createdAt: '2024-01-01'
  },
  {
    id: 3,
    name: 'Winter Clearance',
    description: 'Clear out winter inventory',
    discountType: 'fixed',
    discountValue: 50,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: 'Expired',
    applicableProducts: ['Winter Essentials'],
    applicableCategories: [],
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    createdAt: '2024-02-15'
  }
]

const products = ['Summer Collection 2024', 'Winter Essentials', 'Spring Arrivals', 'Kids Collection']
const categories = ['Women', 'Men', 'Kids', 'Home']

export default function Sales() {
  const [sales, setSales] = useState(initialSales)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSale, setEditingSale] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    status: 'Active',
    applicableProducts: [],
    applicableCategories: [],
    minOrderAmount: '',
    maxDiscountAmount: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingSale) {
      // Update existing sale
      setSales(sales.map(sale => 
        sale.id === editingSale.id 
          ? { 
              ...sale, 
              ...formData, 
              discountValue: parseFloat(formData.discountValue),
              minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
              maxDiscountAmount: parseFloat(formData.maxDiscountAmount) || 0
            }
          : sale
      ))
    } else {
      // Add new sale
      const newSale = {
        id: Date.now(),
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
        maxDiscountAmount: parseFloat(formData.maxDiscountAmount) || 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setSales([...sales, newSale])
    }
    
    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (sale) => {
    setEditingSale(sale)
    setFormData({
      name: sale.name,
      description: sale.description,
      discountType: sale.discountType,
      discountValue: sale.discountValue.toString(),
      startDate: sale.startDate,
      endDate: sale.endDate,
      status: sale.status,
      applicableProducts: sale.applicableProducts,
      applicableCategories: sale.applicableCategories,
      minOrderAmount: sale.minOrderAmount.toString(),
      maxDiscountAmount: sale.maxDiscountAmount.toString()
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setSales(sales.filter(sale => sale.id !== id))
  }

  const handleProductChange = (product) => {
    const newProducts = formData.applicableProducts.includes(product)
      ? formData.applicableProducts.filter(p => p !== product)
      : [...formData.applicableProducts, product]
    setFormData({...formData, applicableProducts: newProducts})
  }

  const handleCategoryChange = (category) => {
    const newCategories = formData.applicableCategories.includes(category)
      ? formData.applicableCategories.filter(c => c !== category)
      : [...formData.applicableCategories, category]
    setFormData({...formData, applicableCategories: newCategories})
  }

  const resetForm = () => {
    setEditingSale(null)
    setFormData({
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      startDate: '',
      endDate: '',
      status: 'Active',
      applicableProducts: [],
      applicableCategories: [],
      minOrderAmount: '',
      maxDiscountAmount: ''
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Scheduled':
        return 'bg-gray-100 text-gray-800'
      case 'Expired':
        return 'bg-red-100 text-red-800'
      case 'Inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Sales & Discounts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage sales campaigns and discount offers.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSale ? 'Edit Sale' : 'Create New Sale'}
                </DialogTitle>
                <DialogDescription>
                  {editingSale 
                    ? 'Update the sale details below.'
                    : 'Create a new sale or discount campaign.'
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Sale Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter sale name"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter sale description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="discountType">Discount Type</Label>
                      <select
                        id="discountType"
                        value={formData.discountType}
                        onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (SYP)</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="discountValue">
                        Discount Value {formData.discountType === 'percentage' ? '(%)' : '(SYP)'}
                      </Label>
                      <Input
                        id="discountValue"
                        type="number"
                        step={formData.discountType === 'percentage' ? '1' : '0.01'}
                        value={formData.discountValue}
                        onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                        placeholder={formData.discountType === 'percentage' ? '25' : '50.00'}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="minOrderAmount">Min Order Amount (SYP)</Label>
                      <Input
                        id="minOrderAmount"
                        type="number"
                        step="0.01"
                        value={formData.minOrderAmount}
                        onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maxDiscountAmount">Max Discount Amount (SYP)</Label>
                      <Input
                        id="maxDiscountAmount"
                        type="number"
                        step="0.01"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Applicable Products</Label>
                    <div className="flex flex-wrap gap-2">
                      {products.map(product => (
                        <label key={product} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.applicableProducts.includes(product)}
                            onChange={() => handleProductChange(product)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm">{product}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Applicable Categories</Label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <label key={category} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.applicableCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm">{category}</span>
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
                      <option value="Scheduled">Scheduled</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingSale ? 'Update Sale' : 'Create Sale'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sale Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <PercentBadgeIcon className="h-10 w-10 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{sale.name}</div>
                            <div className="text-sm text-gray-500">{sale.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {sale.discountType === 'percentage' 
                            ? `${sale.discountValue}%`
                            : `SYP ${sale.discountValue}`
                          }
                        </div>
                        {sale.minOrderAmount > 0 && (
                          <div className="text-sm text-gray-500">
                            Min: SYP {sale.minOrderAmount}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{sale.startDate}</div>
                        <div>to {sale.endDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(sale)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(sale.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

