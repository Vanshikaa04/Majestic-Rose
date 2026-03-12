// pages/AddProduct.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, X, Upload, Loader, Star, Image as ImageIcon } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'fashion',
    subcategory: '',
    price: '',
    description: '',
    media: [],
    whatsappNumber: '+919979007261',
    stockStatus: 'instock'
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mainCategories = [
    { value: 'fashion', label: 'Fashion' },
    { value: 'jewellery', label: 'Jewellery' },
    { value: 'stoles-scarves', label: 'Stoles & Scarves' }
  ];

  const jewellerySubcategories = [
    { value: 'necklace', label: 'Necklace' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'rings', label: 'Rings' }
  ];

  const stockOptions = [
    { value: 'instock', label: 'In Stock', color: 'bg-green-100 text-green-800' },
    { value: 'soldout', label: 'Sold Out', color: 'bg-red-100 text-red-800' },
    { value: 'customization', label: 'Customization Available', color: 'bg-purple-100 text-purple-800' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset subcategory when category changes from jewellery to something else
    if (name === 'category' && value !== 'jewellery') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        subcategory: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: false
    }));
    
    setFormData(prev => ({
      ...prev,
      media: [...prev.media, ...newPreviews]
    }));
  };

  const removeFile = (index) => {
    if (formData.media[index]?.preview) {
      URL.revokeObjectURL(formData.media[index].preview);
    }
    
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const setPrimaryMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.map((media, i) => ({
        ...media,
        isPrimary: i === index
      }))
    }));
  };

  const uploadFilesToCloudinary = async () => {
    if (selectedFiles.length === 0) return [];
    
    setUploading(true);
    setUploadProgress(0);
    
    const uploadData = new FormData();
    selectedFiles.forEach(file => {
      uploadData.append('media', file);
    });
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in to upload files');
      }

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      const uploadedMedia = await response.json();
      
      if (!Array.isArray(uploadedMedia)) {
        throw new Error('Invalid response format');
      }
      
      const mediaWithPrimary = uploadedMedia.map((media, index) => ({
        ...media,
        isPrimary: formData.media[index]?.isPrimary || false
      }));
      
      setUploadProgress(100);
      return mediaWithPrimary;
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Error uploading files');
      throw error;
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (selectedFiles.length === 0) {
    alert('Please select at least one image');
    return;
  }
  
  // Validate based on category
  if (formData.category === 'fashion' && !formData.name.trim()) {
    alert('Product name is required for Fashion category');
    return;
  }
  
  if (formData.category === 'jewellery' && !formData.subcategory) {
    alert('Please select a subcategory for jewellery');
    return;
  }
  
  setIsSubmitting(true);
  setUploadError('');
  
  try {
    const uploadedMedia = await uploadFilesToCloudinary();
    
    if (uploadedMedia.length === 0) {
      throw new Error('Failed to upload images');
    }
    
    if (!uploadedMedia.some(m => m.isPrimary)) {
      uploadedMedia[0].isPrimary = true;
    }
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    // Build the product data object with proper types
    const productData = {
      category: formData.category,
      price: Number(formData.price), // Ensure price is a number
      description: formData.description,
      media: uploadedMedia,
      whatsappNumber: formData.whatsappNumber,
      stockStatus: formData.stockStatus
    };

    // Add name if it exists
    if (formData.name && formData.name.trim()) {
      productData.name = formData.name.trim();
    }

    // Add subcategory for jewellery
    if (formData.category === 'jewellery') {
      productData.subcategory = formData.subcategory; // This should be a string like 'earrings'
    }

    console.log('Sending product data (stringified):', JSON.stringify(productData, null, 2));

    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    const responseData = await response.json();

    if (response.ok) {
      alert('Product added successfully!');
      formData.media.forEach(media => {
        if (media.preview) URL.revokeObjectURL(media.preview);
      });
      navigate('/admin');
    } else {
      console.error('Server error:', responseData);
      
      // Show more detailed error
      if (responseData.errors) {
        const errorMessages = Object.values(responseData.errors).map(err => err.message).join('\n');
        alert(`Validation Error:\n${errorMessages}`);
      } else {
        alert(responseData.message || 'Error adding product');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    alert(error.message || 'Error adding product');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
            {/* Image Upload Section */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-semibold">
                Product Images <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Select images (will be uploaded when you submit the form)
              </p>
              
              {uploadError && (
                <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {uploadError}
                </div>
              )}
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="media-upload"
                  disabled={isSubmitting}
                />
                <label 
                  htmlFor="media-upload"
                  className={`cursor-pointer block ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <span className="text-gray-600 font-medium">
                    Click to select images
                  </span>
                  <p className="text-sm text-gray-400 mt-1">
                    Supports: JPG, PNG, GIF (max 10 files)
                  </p>
                </label>
              </div>

              {/* Upload Progress */}
              <AnimatePresence>
                {uploading && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Uploading to Cloudinary...</span>
                      <span className="text-sm text-gray-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-green-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      ></motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image Preview Grid */}
              {formData.media.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">
                      Selected Images ({formData.media.length}/10)
                    </h3>
                    <p className="text-xs text-gray-500">
                      Click <Star className="w-3 h-3 inline text-green-600" /> to set as primary
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.media.map((media, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group"
                      >
                        <div className={`aspect-square rounded-lg overflow-hidden border-2 ${
                          media.isPrimary ? 'border-green-600 shadow-lg' : 'border-gray-200'
                        }`}>
                          <img 
                            src={media.preview} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {media.isPrimary && (
                          <div className="absolute top-2 right-2 bg-green-600 text-white p-1.5 rounded-full shadow-lg">
                            <Star className="w-3 h-3" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                          {!media.isPrimary && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => setPrimaryMedia(index)}
                              className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                              title="Set as primary"
                              disabled={isSubmitting}
                            >
                              <Star className="w-4 h-4" />
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => removeFile(index)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            title="Remove"
                            disabled={isSubmitting}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Category Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                Main Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                disabled={isSubmitting}
              >
                {mainCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory - Only for Jewellery */}
            {formData.category === 'jewellery' && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">
                  Subcategory <span className="text-red-500">*</span>
                </label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                  disabled={isSubmitting}
                >
                  <option value="">Select subcategory</option>
                  {jewellerySubcategories.map(sub => (
                    <option key={sub.value} value={sub.value}>
                      {sub.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Name Field - Required for Fashion, Optional for others */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                {formData.category === 'fashion' ? 'Product Name' : 'Name (Optional)'}
                {formData.category === 'fashion' && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={formData.category === 'fashion'}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                placeholder={formData.category === 'fashion' ? "Enter product name" : "Enter name (optional)"}
                disabled={isSubmitting}
              />
              {formData.category !== 'fashion' && (
                <p className="text-xs text-gray-500 mt-1">Name is optional. Leave empty for unnamed products.</p>
              )}
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                placeholder="0"
                disabled={isSubmitting}
              />
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                Stock Status <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {stockOptions.map(option => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      formData.stockStatus === option.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name="stockStatus"
                      value={option.value}
                      checked={formData.stockStatus === option.value}
                      onChange={handleChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${option.color}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* WhatsApp Number */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">+91</span>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber.replace('+91', '')}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      whatsappNumber: `+91${value}`
                    }));
                  }}
                  required
                  placeholder="9979007261"
                  className="w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-semibold">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition resize-y"
                placeholder="Enter product description..."
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={uploading || isSubmitting}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    {uploading ? 'Uploading Images...' : 'Adding Product...'}
                  </>
                ) : (
                  'Add Product'
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate('/admin')}
                disabled={isSubmitting}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProduct;