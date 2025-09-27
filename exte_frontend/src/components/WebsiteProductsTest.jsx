import { useState, useEffect } from 'react'
import OptimizedProductCard from './OptimizedProductCard'

function WebsiteProductsTest() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products')
        const data = await response.json()
        // Get first 4 products (same as featured products)
        setProducts(data.slice(0, 4))
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
      <h1>Website Products Test</h1>
      <p>These are the actual OptimizedProductCard components used on the main website.</p>
      
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {products.map(product => (
            <OptimizedProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e8f4fd', borderRadius: '8px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Make sure you're logged in (register/login if needed)</li>
          <li>Click "Add to Cart" on any product</li>
          <li>For products with variants: Color and size are automatically selected</li>
          <li>You can change the selection if you want</li>
          <li>Check browser console (F12) for detailed logs</li>
        </ol>
      </div>
    </div>
  )
}

export default WebsiteProductsTest
