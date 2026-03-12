// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Log the values being passed (for debugging)
console.log('🔧 Initializing Cloudinary with:');
console.log('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || '❌ MISSING');
console.log('- API Key:', process.env.CLOUDINARY_API_KEY ? '✓ Present (length: ' + process.env.CLOUDINARY_API_KEY.length + ')' : '❌ MISSING');
console.log('- API Secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Present (length: ' + process.env.CLOUDINARY_API_SECRET.length + ')' : '❌ MISSING');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Verify the configuration was applied
const config = cloudinary.config();
console.log('✅ Cloudinary configured:', {
  cloud_name: config.cloud_name ? '✓' : '✗',
  api_key: config.api_key ? '✓' : '✗',
  api_secret: config.api_secret ? '✓' : '✗'
});

if (!config.cloud_name || !config.api_key || !config.api_secret) {
  console.error('❌ Cloudinary configuration failed! Check your .env file.');
}

module.exports = cloudinary;