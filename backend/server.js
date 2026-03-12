// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('./models/Product');
const Admin = require('./models/Admin');
const cloudinary = require('./config/cloudinary');
const { uploadMultiple } = require('./middleware/upload');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
"https:/localhost:5000",
"https://majestic-rose-backend.vercel.app/"

  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow non-browser tools like Postman
      if (!origin) return callback(null, true);
  
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(' CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // if using cookies or Authorization headers
  };
  
  app.use(cors(corsOptions));
app.use(express.json());

// Debug: Check environment variables
console.log('🔧 Environment Check:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing');
console.log('JWT Secret:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');
console.log('MongoDB URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Missing');


// Verify Cloudinary configuration
const cloudinaryConfig = cloudinary.config();
console.log('☁️ Cloudinary Config:', {
  cloud_name: cloudinaryConfig.cloud_name ? '✓' : '✗',
  api_key: cloudinaryConfig.api_key ? '✓' : '✗',
  api_secret: cloudinaryConfig.api_secret ? '✓' : '✗'
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/majesticrose-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected successfully');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.admin = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Create and assign token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );
    
    res.json({ 
      token, 
      admin: { 
        id: admin._id, 
        email: admin.email 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Verify token
app.get('/api/admin/verify', verifyToken, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    // For jewellery, return all jewellery products
    if (category === 'jewellery') {
      const products = await Product.find({ category: 'jewellery' });
      return res.json(products);
    }
    
    // For other categories
    const products = await Product.find({ category });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get jewellery by subcategory
app.get('/api/products/jewellery/:subcategory', async (req, res) => {
  try {
    const { subcategory } = req.params;
    const products = await Product.find({ 
      category: 'jewellery',
      subcategory: subcategory
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all jewellery products (with subcategories)
app.get('/api/products/jewellery/all', async (req, res) => {
  try {
    const products = await Product.find({ 
      category: 'jewellery'
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ FIXED: Add new product (protected) - INCLUDING SUBCATEGORY
app.post('/api/products', verifyToken, async (req, res) => {
  try {
    console.log('📦 Received product data:', JSON.stringify(req.body, null, 2));
    
    // Create product with all fields including subcategory
    const productData = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      media: req.body.media,
      whatsappNumber: req.body.whatsappNumber,
      stockStatus: req.body.stockStatus || 'instock'
    };

    // Only add subcategory if it exists in the request body
    // (for jewellery products)
    if (req.body.subcategory) {
      productData.subcategory = req.body.subcategory;
    }

    const product = new Product(productData);
    const newProduct = await product.save();
    console.log('✅ Product added:', newProduct._id);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('❌ Error adding product:', err);
    res.status(400).json({ message: err.message, errors: err.errors });
  }
});

// ✅ FIXED: Update product (protected) - INCLUDING SUBCATEGORY
app.put('/api/products/:id', verifyToken, async (req, res) => {
  try {
    console.log('📦 Updating product:', req.params.id);
    console.log('Update data:', JSON.stringify(req.body, null, 2));
    
    // Prepare update data
    const updateData = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      media: req.body.media,
      whatsappNumber: req.body.whatsappNumber,
      stockStatus: req.body.stockStatus
    };

    // Only add subcategory if it exists in the request body
    // (for jewellery products)
    if (req.body.subcategory) {
      updateData.subcategory = req.body.subcategory;
    } else {
      // For non-jewellery, explicitly set subcategory to undefined
      // so it's removed from the document
      updateData.subcategory = undefined;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log('✅ Product updated:', product._id);
    res.json(product);
  } catch (err) {
    console.error('❌ Error updating product:', err);
    res.status(400).json({ message: err.message, errors: err.errors });
  }
});

// Delete product (protected)
app.delete('/api/products/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete all media from Cloudinary
    if (product.media && product.media.length > 0) {
      for (const media of product.media) {
        try {
          await cloudinary.uploader.destroy(media.publicId, {
            resource_type: media.type
          });
          console.log(`✅ Deleted from Cloudinary: ${media.publicId}`);
        } catch (cloudinaryError) {
          console.error('Error deleting from Cloudinary:', cloudinaryError);
          // Continue with product deletion even if Cloudinary delete fails
        }
      }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    console.log('✅ Product deleted:', product._id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: err.message });
  }
});

// Upload media to Cloudinary (protected)
app.post('/api/upload', verifyToken, uploadMultiple, async (req, res) => {
  try {
    console.log('📁 Files received for upload:', req.files?.length || 0);
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    // Verify Cloudinary is configured
    const config = cloudinary.config();
    if (!config.api_key) {
      throw new Error('Cloudinary API key not configured!');
    }
    
    const uploadPromises = files.map(async (file) => {
      const isVideo = file.mimetype.startsWith('video/');
      
      console.log(`⏫ Uploading ${file.originalname} (${isVideo ? 'video' : 'image'})...`);
      
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: isVideo ? 'majesticrose-store/videos' : 'majesticrose-store/images',
            resource_type: isVideo ? 'video' : 'image',
            timeout: 120000
          },
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary upload error:', error);
              reject(error);
            } else {
              console.log('✅ Cloudinary upload success:', result.public_id);
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                type: isVideo ? 'video' : 'image'
              });
            }
          }
        );
        
        uploadStream.end(file.buffer);
      });
    });
    
    const uploadedMedia = await Promise.all(uploadPromises);
    console.log('✅ All uploads completed:', uploadedMedia.length);
    res.json(uploadedMedia);
    
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ 
      message: err.message || 'Error uploading files to Cloudinary',
      error: err.toString()
    });
  }
});

// Delete single media from Cloudinary (protected)
app.post('/api/delete-media', verifyToken, async (req, res) => {
  try {
    const { publicId, type } = req.body;
    
    if (!publicId) {
      return res.status(400).json({ message: 'Public ID is required' });
    }
    
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: type || 'image'
    });
    
    console.log('✅ Media deleted from Cloudinary:', publicId, result);
    res.json({ message: 'Media deleted successfully', result });
  } catch (err) {
    console.error('Error deleting media:', err);
    res.status(500).json({ message: err.message });
  }
});

// Test route to check if server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Test the server: http://localhost:${PORT}/api/test`);
});