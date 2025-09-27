import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

function Home() {
  // Sample product data
  const products = [
    {
      id: 1,
      name: "TEXTURED BLAZER",
      price: "89.95",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
      category: "WOMAN",
      colors: ["Black", "Navy", "Beige"],
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 2,
      name: "WIDE-LEG TROUSERS",
      price: "45.95",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop",
      category: "WOMAN",
      colors: ["Black", "White", "Gray"],
      sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
      id: 3,
      name: "KNIT SWEATER",
      price: "35.95",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop",
      category: "WOMAN",
      colors: ["Cream", "Pink", "Blue"],
      sizes: ["S", "M", "L"]
    },
    {
      id: 4,
      name: "DENIM JACKET",
      price: "59.95",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop",
      category: "MAN",
      colors: ["Blue", "Black", "Light Blue"],
      sizes: ["M", "L", "XL", "XXL"]
    },
    {
      id: 5,
      name: "COTTON SHIRT",
      price: "29.95",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop",
      category: "MAN",
      colors: ["White", "Blue", "Gray"],
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 6,
      name: "PLEATED DRESS",
      price: "69.95",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop",
      category: "WOMAN",
      colors: ["Red", "Black", "Navy"],
      sizes: ["XS", "S", "M", "L"]
    }
  ]

  return (
    <div>
      {/* Hero Section with Video */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/6479/6479-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop"
            alt="Fashion collection"
            className="w-full h-full object-cover"
          />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-6xl font-light mb-4">NEW COLLECTION</h2>
            <p className="text-lg md:text-xl mb-8">Discover the latest trends</p>
            <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-sm font-medium">
              SHOP NOW
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/category/woman" className="relative group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=400&fit=crop"
                alt="Woman"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-4">
                <h3 className="text-white text-xl font-medium">WOMAN</h3>
              </div>
            </Link>
            <Link to="/category/man" className="relative group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"
                alt="Man"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-4">
                <h3 className="text-white text-xl font-medium">MAN</h3>
              </div>
            </Link>
            <Link to="/category/kids" className="relative group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=300&h=400&fit=crop"
                alt="Kids"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-4">
                <h3 className="text-white text-xl font-medium">KIDS</h3>
              </div>
            </Link>
            <Link to="/category/home" className="relative group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=400&fit=crop"
                alt="Home"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-4">
                <h3 className="text-white text-xl font-medium">HOME</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-center mb-12">TRENDING NOW</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group cursor-pointer">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 md:h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-6 w-6 text-white hover:fill-current cursor-pointer" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                  <h3 className="text-sm font-medium mb-2">{product.name}</h3>
                  <p className="text-sm font-semibold">SYP {product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

