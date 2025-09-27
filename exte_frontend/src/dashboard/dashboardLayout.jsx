import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './sidebar'
import Header from './Header'
import Dashboard from './dashboard'
import Collections from './collections'
import Categories from './category'
import Products from './product'
import Sales from './sales'
import Orders from './order'
import VideoManagement from './video'
import './App.css'

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
      
      <div className="min-h-screen bg-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="lg:pl-64">
          <Header setSidebarOpen={setSidebarOpen} />
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />              
              
            </div>
          </main>
        </div>
      </div>
    
  )
}

export default DashboardLayout

