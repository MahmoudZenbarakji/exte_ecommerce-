import React from 'react';
import { 
  Info as InformationCircleIcon, 
  CheckCircle as CheckCircleIcon, 
  AlertTriangle as ExclamationTriangleIcon,
  Lightbulb as LightBulbIcon,
  Image as PhotoIcon,
  Tag as TagIcon,
  Package as CubeIcon
} from 'lucide-react';

const AdminGuide = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <InformationCircleIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-900">Product Management Guide</h2>
        </div>
        <p className="text-blue-800">
          Welcome to the product management system! This guide will help you understand how to effectively manage your products, colors, and images.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Creation */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <CubeIcon className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Creating Products</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Fill in all required fields: name, price, category, and stock</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Upload a high-quality product image (recommended: 800x800px)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Select available colors and sizes to create variants</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Set product status (Active/Inactive) and featured status</span>
            </li>
          </ul>
        </div>

        {/* Color & Image Management */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <PhotoIcon className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Color & Image Management</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Click "Manage" on any product to access color management</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Add multiple colors for the same product</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Upload specific images for each color variant</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Set different prices and stock levels per color</span>
            </li>
          </ul>
        </div>

        {/* Best Practices */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <LightBulbIcon className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Best Practices</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use descriptive product names and detailed descriptions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Keep product images consistent in style and quality</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Regularly update stock levels to avoid overselling</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use SKU codes for better inventory tracking</span>
            </li>
          </ul>
        </div>

        {/* Important Notes */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Important Notes</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span>Inactive products won't appear in the customer-facing store</span>
            </li>
            <li className="flex items-start gap-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span>Deleting a product will remove all associated data permanently</span>
            </li>
            <li className="flex items-start gap-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span>Image uploads may take a few moments to process</span>
            </li>
            <li className="flex items-start gap-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span>Always test product creation with a small batch first</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <TagIcon className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-indigo-600 mb-2">1</div>
            <h4 className="font-medium text-gray-900 mb-1">Create Product</h4>
            <p className="text-sm text-gray-600">Add basic product information and upload an image</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-indigo-600 mb-2">2</div>
            <h4 className="font-medium text-gray-900 mb-1">Add Colors</h4>
            <p className="text-sm text-gray-600">Use the Manage button to add color variants and images</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-indigo-600 mb-2">3</div>
            <h4 className="font-medium text-gray-900 mb-1">Set Active</h4>
            <p className="text-sm text-gray-600">Make sure to set the product status to Active</p>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-green-900">Need Help?</h3>
        </div>
        <p className="text-green-800 text-sm">
          If you encounter any issues or need assistance with product management, 
          please contact your system administrator or refer to the technical documentation.
        </p>
      </div>
    </div>
  );
};

export default AdminGuide;
































