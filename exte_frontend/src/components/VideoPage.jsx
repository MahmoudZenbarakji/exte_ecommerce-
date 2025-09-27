import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrashIcon, PlusIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { useAuth } from '../contexts.jsx'

function VideoPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    url: '',
    type: 'embed' // 'embed' or 'upload'
  })
  const [loading, setLoading] = useState(false)

  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN'

  // Load videos from localStorage on component mount
  useEffect(() => {
    const savedVideos = localStorage.getItem('videos')
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos))
    }
  }, [])

  // Save videos to localStorage whenever videos state changes
  useEffect(() => {
    localStorage.setItem('videos', JSON.stringify(videos))
  }, [videos])

  const handleAddVideo = () => {
    if (!newVideo.title.trim() || !newVideo.url.trim()) {
      alert('Please fill in all required fields')
      return
    }

    const video = {
      id: Date.now().toString(),
      title: newVideo.title,
      description: newVideo.description,
      url: newVideo.url,
      type: newVideo.type,
      createdAt: new Date().toISOString()
    }

    setVideos([...videos, video])
    setNewVideo({ title: '', description: '', url: '', type: 'embed' })
    setIsAddModalOpen(false)
  }

  const handleDeleteVideo = (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(video => video.id !== videoId))
    }
  }

  const getEmbedUrl = (url) => {
    // Handle YouTube URLs
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    // Handle YouTube short URLs
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    // Handle Vimeo URLs
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}`
    }
    // Return original URL if it's already an embed URL or direct video file
    return url
  }

  const renderVideo = (video) => {
    if (video.type === 'embed') {
      return (
        <iframe
          src={getEmbedUrl(video.url)}
          title={video.title}
          className="w-full h-64 md:h-80 rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    } else {
      return (
        <video
          controls
          className="w-full h-64 md:h-80 rounded-lg"
          preload="metadata"
        >
          <source src={video.url} type="video/mp4" />
          <source src={video.url} type="video/webm" />
          <source src={video.url} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Gallery</h1>
          <p className="text-gray-600">Watch our featured videos</p>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-8 flex justify-center">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Video</span>
            </Button>
          </div>
        )}

        {/* Videos Grid */}
        <div className="space-y-8">
          {videos.length === 0 ? (
            <div className="text-center py-12">
              <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No videos yet</h3>
              <p className="text-gray-500">
                {isAdmin ? 'Add your first video to get started!' : 'Check back later for new videos.'}
              </p>
            </div>
          ) : (
            videos.map((video) => (
              <Card key={video.id} className="w-full max-w-3xl mx-auto shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                        {video.title}
                      </CardTitle>
                      {video.description && (
                        <p className="text-gray-600 text-sm">{video.description}</p>
                      )}
                    </div>
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteVideo(video.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg p-4">
                    {renderVideo(video)}
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    Added on {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Go Home Button */}
        <div className="text-center mt-12">
          <Button
            onClick={() => navigate('/home')}
            className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-medium"
          >
            Go Home
          </Button>
        </div>
      </div>

      {/* Add Video Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Video</DialogTitle>
            <DialogDescription>
              Add a new video to the gallery. You can embed from YouTube/Vimeo or upload a video file.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="video-title">Video Title *</Label>
              <Input
                id="video-title"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                placeholder="Enter video title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="video-description">Description</Label>
              <Textarea
                id="video-description"
                value={newVideo.description}
                onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                placeholder="Enter video description (optional)"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="video-type">Video Type</Label>
              <select
                id="video-type"
                value={newVideo.type}
                onChange={(e) => setNewVideo({ ...newVideo, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="embed">Embed (YouTube, Vimeo)</option>
                <option value="upload">Upload (Direct Video File)</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="video-url">
                {newVideo.type === 'embed' ? 'Video URL *' : 'Video File URL *'}
              </Label>
              <Input
                id="video-url"
                value={newVideo.url}
                onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                placeholder={
                  newVideo.type === 'embed' 
                    ? 'https://www.youtube.com/watch?v=... or https://vimeo.com/...'
                    : 'https://example.com/video.mp4'
                }
                required
              />
              {newVideo.type === 'embed' && (
                <p className="text-xs text-gray-500">
                  Supported: YouTube, Vimeo. Paste the full URL from your browser.
                </p>
              )}
              {newVideo.type === 'upload' && (
                <p className="text-xs text-gray-500">
                  Enter the direct URL to your video file (MP4, WebM, OGG).
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddVideo}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Video'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default VideoPage








