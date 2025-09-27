import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Textarea } from './components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Trash2, Plus, Play, Edit, Eye, Upload, FileVideo, X } from 'lucide-react'
import { toast } from 'sonner'

const VideoManagement = () => {
  const [videos, setVideos] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState(null)
  const [loading, setLoading] = useState(false)
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    type: 'embed'
  })
  
  // File upload states
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Load videos from localStorage on component mount
  useEffect(() => {
    const savedVideos = localStorage.getItem('introVideos')
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos))
    } else {
      // Add default video if no videos exist
      const defaultVideo = {
        id: 'default-intro-video',
        title: 'Welcome to EXTE',
        description: 'Discover our world of fashion, style, and innovation. Experience the latest trends and timeless elegance.',
        url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        type: 'embed',
        createdAt: new Date().toISOString()
      }
      setVideos([defaultVideo])
    }
  }, [])

  // Save videos to localStorage whenever videos state changes
  useEffect(() => {
    localStorage.setItem('introVideos', JSON.stringify(videos))
  }, [videos])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      type: 'embed'
    })
    setUploadedFile(null)
    setUploadProgress(0)
  }

  // File upload functions
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/wmv']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid video file (MP4, WebM, OGG, AVI, MOV, WMV)')
      return
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 100MB')
      return
    }

    setUploadedFile(file)
    setFormData(prev => ({
      ...prev,
      type: 'upload',
      url: file.name
    }))
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
    setFormData(prev => ({
      ...prev,
      type: 'embed',
      url: ''
    }))
  }

  const simulateFileUpload = async (file) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadProgress(i)
    }

    // Create object URL for the uploaded file
    const fileUrl = URL.createObjectURL(file)
    
    setIsUploading(false)
    return fileUrl
  }

  const handleAddVideo = async () => {
    if (!formData.title || (!formData.url && !uploadedFile)) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      let videoUrl = formData.url
      
      // Handle file upload
      if (uploadedFile && formData.type === 'upload') {
        videoUrl = await simulateFileUpload(uploadedFile)
      }

      const newVideo = {
        id: `video-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        url: videoUrl,
        type: formData.type,
        fileName: uploadedFile ? uploadedFile.name : null,
        fileSize: uploadedFile ? uploadedFile.size : null,
        createdAt: new Date().toISOString()
      }

      setVideos(prev => [newVideo, ...prev])
      setIsAddModalOpen(false)
      resetForm()
      toast.success('Video added successfully!')
    } catch (error) {
      toast.error('Failed to add video')
    } finally {
      setLoading(false)
    }
  }

  const handleEditVideo = async () => {
    if (!formData.title || !formData.url) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      setVideos(prev => prev.map(video => 
        video.id === editingVideo.id 
          ? { ...video, ...formData, updatedAt: new Date().toISOString() }
          : video
      ))
      setIsEditModalOpen(false)
      setEditingVideo(null)
      resetForm()
      toast.success('Video updated successfully!')
    } catch (error) {
      toast.error('Failed to update video')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVideo = async (videoId) => {
    if (videos.length === 1) {
      toast.error('Cannot delete the last video. Please add another video first.')
      return
    }

    try {
      setVideos(prev => prev.filter(video => video.id !== videoId))
      toast.success('Video deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete video')
    }
  }

  const openEditModal = (video) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      description: video.description,
      url: video.url,
      type: video.type
    })
    setIsEditModalOpen(true)
  }

  const getEmbedUrl = (url, type) => {
    if (type === 'direct') return url
    
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}`
    }
    
    return url
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Video Management</h1>
          <p className="text-gray-600 mt-2">Manage introduction page videos</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
              <DialogDescription>
                Add a new video to display on the introduction page.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter video title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter video description"
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="type">Video Type *</Label>
                <Select value={formData.type} onValueChange={(value) => {
                  handleInputChange('type', value)
                  if (value !== 'upload') {
                    setUploadedFile(null)
                  }
                }}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="embed">YouTube/Vimeo Embed</SelectItem>
                    <SelectItem value="direct">Direct Video URL</SelectItem>
                    <SelectItem value="upload">Upload Video File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.type === 'upload' ? (
                <div>
                  <Label htmlFor="file">Upload Video File *</Label>
                  <div className="mt-1">
                    {!uploadedFile ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          id="file"
                          accept="video/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <label htmlFor="file" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-1">Click to upload video file</p>
                          <p className="text-xs text-gray-500">MP4, WebM, OGG, AVI, MOV, WMV (max 100MB)</p>
                        </label>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileVideo className="h-8 w-8 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                              <p className="text-xs text-gray-500">
                                {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeUploadedFile}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {isUploading && (
                          <div className="mt-3">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="url">Video URL *</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    placeholder="Enter video URL"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    For YouTube: https://www.youtube.com/watch?v=VIDEO_ID<br/>
                    For Vimeo: https://vimeo.com/VIDEO_ID<br/>
                    For direct videos: Direct URL to video file
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddVideo} disabled={loading}>
                {loading ? 'Adding...' : 'Add Video'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {video.description}
                  </CardDescription>
                </div>
                <div className="flex space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(video)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteVideo(video.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
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
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              
              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <span className="capitalize">{video.type}</span>
                  {video.fileName && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {video.fileName}
                    </span>
                  )}
                </div>
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              </div>
              
              {video.fileSize && (
                <div className="mt-2 text-xs text-gray-400">
                  File size: {(video.fileSize / (1024 * 1024)).toFixed(2)} MB
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
            <DialogDescription>
              Update the video information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter video title"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter video description"
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-type">Video Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="embed">YouTube/Vimeo Embed</SelectItem>
                  <SelectItem value="direct">Direct Video URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-url">Video URL *</Label>
              <Input
                id="edit-url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="Enter video URL"
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditVideo} disabled={loading}>
              {loading ? 'Updating...' : 'Update Video'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default VideoManagement
