import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { ArrowRight, UserPlus, LogIn } from 'lucide-react'

const IntroductionPage = () => {
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const videoRefs = useRef([])

  // Load videos from localStorage
  useEffect(() => {
    const loadVideos = () => {
      try {
        const savedVideos = localStorage.getItem('introVideos')
        if (savedVideos) {
          const parsedVideos = JSON.parse(savedVideos)
          setVideos(parsedVideos)
        } else {
          // Default videos if none exist
          const defaultVideos = [
            {
              id: 'default-1',
              title: 'Welcome to EXTE',
              description: 'Discover our world of fashion, style, and innovation. Experience the latest trends and timeless elegance.',
              url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
              type: 'embed'
            },
            {
              id: 'default-2', 
              title: 'Our Story',
              description: 'From humble beginnings to global recognition, learn about our journey in the fashion industry.',
              url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              type: 'embed'
            },
            {
              id: 'default-3',
              title: 'Latest Collection',
              description: 'Explore our newest collection featuring contemporary designs and sustainable fashion.',
              url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
              type: 'embed'
            }
          ]
          setVideos(defaultVideos)
          localStorage.setItem('introVideos', JSON.stringify(defaultVideos))
        }
      } catch (error) {
        console.error('Error loading videos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  // Set up intersection observer for videos
  useEffect(() => {
    const observers = videoRefs.current.map((ref) => {
      if (!ref) return null
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target.querySelector('video')
            if (video) {
              if (entry.isIntersecting) {
                video.play().catch(console.error)
              } else {
                video.pause()
              }
            }
          })
        },
        { threshold: 0.5 }
      )
      
      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach(observer => observer?.disconnect())
    }
  }, [videos])

  const getEmbedUrl = (url, type) => {
    if (type === 'direct') return url
    
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&showinfo=0&rel=0&loop=1&playlist=${videoId}`
    }
    
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&showinfo=0&rel=0&loop=1&playlist=${videoId}`
    }
    
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&controls=1&loop=1`
    }
    
    return url
  }

  const handleGoToHome = () => {
    navigate('/home')
  }

  const handleGoToRegister = () => {
    navigate('/register')
  }

  const handleGoToLogin = () => {
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <div className="absolute top-0 right-0 p-6 z-10">
        <div className="flex space-x-3">
          <button
            onClick={handleGoToLogin}
            className="flex items-center px-4 py-2 bg-white/95 backdrop-blur-sm hover:bg-white text-gray-800 hover:text-gray-900 shadow-md hover:shadow-lg transition-all duration-300 font-medium rounded-md border border-gray-200 hover:border-gray-300"
          >
            <LogIn className="h-4 w-4 mr-2" />
            <span>Login</span>
          </button>
          <button
            onClick={handleGoToRegister}
            className="flex items-center px-4 py-2 bg-white/95 backdrop-blur-sm hover:bg-white text-gray-800 hover:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 font-medium rounded-md border border-gray-300 hover:border-gray-400"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            <span>Register</span>
          </button>
        </div>
      </div>

      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center pt-20 pb-16">
        <div className="text-center">
          {/* Logo */}
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-4xl font-bold text-white">EXTE</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to EXTE
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Discover our world of fashion, style, and innovation. Experience the latest trends and timeless elegance.
          </p>
        </div>
      </div>

      {/* Videos Section */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        {videos.map((video, index) => (
          <div
            key={video.id}
            ref={el => videoRefs.current[index] = el}
            className="mb-16 last:mb-0"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              {/* Video Header */}
              <div className="p-8 pb-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{video.title}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">{video.description}</p>
              </div>
              
              {/* Video Container */}
              <div className="relative">
                <div className="aspect-video bg-gray-100">
                  {video.type === 'embed' ? (
                    <iframe
                      src={getEmbedUrl(video.url, video.type)}
                      title={video.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={video.url}
                      controls
                      className="w-full h-full"
                      preload="metadata"
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={video.type === 'upload' ? undefined : undefined}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                
                {/* Video type indicator */}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    video.type === 'upload' 
                      ? 'bg-green-100 text-green-800' 
                      : video.type === 'embed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {video.type === 'upload' ? 'Uploaded' : video.type === 'embed' ? 'Embedded' : 'Direct'}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 animate-pulse">
                    Auto Play
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation Button */}
      <div className="flex justify-center pb-20">
        <Button
          onClick={handleGoToHome}
          size="lg"
          className="bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-700 hover:to-gray-500 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Explore Our Collection
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default IntroductionPage