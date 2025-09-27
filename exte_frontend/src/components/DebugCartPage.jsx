import { useState, useEffect } from 'react'
import DebugProductCard from './DebugProductCard'
import SimpleProductCard from './SimpleProductCard'

function DebugCartPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products')
        const data = await response.json()
        setProducts(data.slice(0, 2)) // Get first 2 products for testing
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading products...</h2>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Debug Cart Page</h1>
      <p>This page shows real products with debug information to test cart functionality.</p>
      
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div>
          <h2>Simple Product Cards (No Variants)</h2>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {products.map(product => (
              <SimpleProductCard key={`simple-${product.id}`} product={product} />
            ))}
          </div>
          
          <h2>Debug Product Cards (With Variants)</h2>
          {products.map(product => (
            <DebugProductCard key={`debug-${product.id}`} product={product} />
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e8f4fd', borderRadius: '8px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Make sure you're logged in (register/login if needed)</li>
          <li>For products with variants: Select a color first, then a size</li>
          <li>Click "Add to Cart" button</li>
          <li>Check the message and cart count</li>
          <li>Open browser console (F12) to see detailed logs</li>
        </ol>
      </div>
    </div>
  )
}

export default DebugCartPage
