import { Button } from './ui/button.jsx'
import { Link } from 'react-router-dom'
// import { useAuth } from '../contexts.jsx'

function Footer() {
  // const { isAuthenticated } = useAuth()
  return (
    <>
      {/* Newsletter */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light mb-4">STAY IN THE KNOW</h2>
          <p className="text-lg mb-8">Subscribe to our newsletter for the latest updates</p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 text-black focus:outline-none"
            />
            <Button className="bg-white text-black hover:bg-gray-100 px-6 py-3">
              SUBSCRIBE
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-4">HELP</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">Customer Service</a></li>
                <li><a href="#" className="hover:text-black">Size Guide</a></li>
                <li><a href="#" className="hover:text-black">Returns</a></li>
                <li><a href="#" className="hover:text-black">Exchanges</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">ABOUT</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">About Us</a></li>
                <li><a href="#" className="hover:text-black">Careers</a></li>
                <li><a href="#" className="hover:text-black">Press</a></li>
                <li><a href="#" className="hover:text-black">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">LEGAL</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-black">Terms of Use</a></li>
                <li><a href="#" className="hover:text-black">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">FOLLOW US</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">Instagram</a></li>
                <li><a href="#" className="hover:text-black">Facebook</a></li>
                <li><a href="#" className="hover:text-black">Twitter</a></li>
                <li><a href="#" className="hover:text-black">YouTube</a></li>
              </ul>
            </div>
            {/* <div>
              <h3 className="text-sm font-semibold mb-4">ADMIN</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {isAuthenticated ? (
                  <li><Link to="/dashboard" className="hover:text-black">Dashboard</Link></li>
                ) : (
                  <li><Link to="/admin/login" className="hover:text-black">Admin Login</Link></li>
                )}
              </ul>
            </div> */}
          </div>
          <div className="border-t border-gray-300 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">© 2024 ZARA Style. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer

