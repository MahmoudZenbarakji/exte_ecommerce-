import imageCompression from 'browser-image-compression';

/**
 * Compress image before upload to reduce file size
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 1, // Maximum file size in MB
    maxWidthOrHeight: 1200, // Maximum width or height
    useWebWorker: true, // Use web worker for better performance
    fileType: 'image/webp', // Convert to WebP for better compression
    initialQuality: 0.8, // Initial quality (0-1)
    alwaysKeepResolution: false, // Allow resizing
    ...options
  };

  try {
    console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    
    const compressedFile = await imageCompression(file, defaultOptions);
    
    console.log('Compressed file size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
    console.log('Compression ratio:', ((1 - compressedFile.size / file.size) * 100).toFixed(1), '%');
    
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    // Return original file if compression fails
    return file;
  }
};

/**
 * Compress multiple images
 * @param {File[]} files - Array of image files to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File[]>} - Array of compressed image files
 */
export const compressImages = async (files, options = {}) => {
  const compressionPromises = files.map(file => compressImage(file, options));
  return Promise.all(compressionPromises);
};

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @returns {Object} - Validation result
 */
export const validateImage = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please select a JPEG, PNG, WebP, or GIF image.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large. Please select an image smaller than 5MB.' };
  }
  
  return { valid: true };
};
