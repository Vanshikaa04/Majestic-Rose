// backend/middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'majesticrose-store/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

// Configure storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'majesticrose-store/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm'],
    chunk_size: 6000000 // For large video files
  }
});

// Create multer upload instances
const uploadImage = multer({ 
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for images
});

const uploadVideo = multer({ 
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for videos
});

// Middleware for handling multiple files
const uploadMultiple = multer({
  storage: multer.memoryStorage(), // Temporary storage before Cloudinary upload
  limits: { fileSize: 100 * 1024 * 1024 }
}).array('media', 10); // Max 10 files

module.exports = { uploadImage, uploadVideo, uploadMultiple };