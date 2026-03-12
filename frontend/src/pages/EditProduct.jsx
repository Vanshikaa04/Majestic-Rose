// pages/EditProduct.jsx
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Video, X, Upload, Loader, Star, ChevronLeft } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';

const EditProduct = () => {
  const {backendurl}= useContext(ProductContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    category: 'fashion',
    price: '',
    description: '',
    media: [],
    whatsappNumber: ''
  });

  const categories = [
    { value: 'fashion', label: 'Fashion' },
    { value: 'jewellery', label: 'Jewellery' },
    { value: 'footwear', label: 'Footwear' }
  ];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${backendurl}/api/products/${id}`);
      const data = await response.json();
      setFormData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('media', file);
    });
    
    try {
      const response = await fetch(`${backendurl}/api/upload`, {
        method: 'POST',
        body: formData
      });
      
      const uploadedMedia = await response.json();
      
      setFormData(prev => ({
        ...prev,
        media: [...prev.media, ...uploadedMedia]
      }));
      
      setUploadProgress(100);
      setTimeout(() => setUploading(false), 500);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading files');
      setUploading(false);
    }
  };

  const removeMedia = async (index) => {
    const mediaToRemove = formData.media[index];
    
    // Confirm deletion
    if (!window.confirm('Are you sure you want to remove this media?')) {
      return;
    }
    
    // Delete from Cloudinary
    try {
      await fetch(`${backendurl}/api/delete-media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          publicId: mediaToRemove.publicId,
          type: mediaToRemove.type
        })
      });
    } catch (error) {
      console.error('Error deleting media:', error);
    }
    
    // Remove from state
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.media.length === 0) {
      alert('Please upload at least one image');
      return;
    }
    
    // Ensure at least one primary media
    if (!formData.media.some(m => m.isPrimary)) {
      setFormData(prev => ({
        ...prev,
        media: prev.media.map((m, i) => i === 0 ? { ...m, isPrimary: true } : m)
      }));
    }
    
    try {
      const response = await fetch(`${backendurl}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Product updated successfully!');
        navigate('/admin');
      } else {
        alert('Error updating product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating product');
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/admin')}
          className="mb-6 flex items-center text-gray-600 hover:text-purple-600 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
            {/* Multiple Media Upload */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-semibold">
                Product Media <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Upload images or videos (max 10 files, 100MB each)
              </p>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="media-upload"
                  disabled={uploading}
                />
                <label 
                  htmlFor="media-upload"
                  className="cursor-pointer block"
                >
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <span className="text-gray-600 font-medium">
                    Click to upload images/videos
                  </span>
                  <p className="text-sm text-gray-400 mt-1">
                    Supports: JPG, PNG, GIF, MP4, MOV
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
                      <span className="text-sm text-gray-600">Uploading...</span>
                      <span className="text-sm text-gray-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-purple-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      ></motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Media Preview Grid */}
              {formData.media.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">
                      Uploaded Media ({formData.media.length}/10)
                    </h3>
                    <p className="text-xs text-gray-500">
                      Click <Star className="w-3 h-3 inline text-purple-600" /> to set as primary
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.media.map((media, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group"
                      >
                        <div className={`aspect-square rounded-lg overflow-hidden border-2 ${
                          media.isPrimary ? 'border-purple-600 shadow-lg' : 'border-gray-200'
                        }`}>
                          {media.type === 'video' ? (
                            <video 
                              src={media.url} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img 
                              src={media.url} 
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        {/* Media Type Badge */}
                        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
                          {media.type === 'video' ? (
                            <>📹 Video</>
                          ) : (
                            <>🖼️ Image</>
                          )}
                        </div>

                        {/* Primary Badge */}
                        {media.isPrimary && (
                          <div className="absolute top-2 right-2 bg-purple-600 text-white p-1.5 rounded-full shadow-lg">
                            <Star className="w-3 h-3" />
                          </div>
                        )}

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                          {!media.isPrimary && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => setPrimaryMedia(index)}
                              className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
                              title="Set as primary"
                            >
                              <Star className="w-4 h-4" />
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => removeMedia(index)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            title="Remove"
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

            {/* Product Name */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                placeholder="Enter product name"
              />
            </div>

            {/* Category and Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* WhatsApp Number */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">+</span>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber.replace('+', '')}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      whatsappNumber: value ? `+${value}` : ''
                    }));
                  }}
                  required
                  placeholder="1234567890"
                  className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Include country code without the + sign (e.g., 1234567890)
              </p>
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition resize-y"
                placeholder="Enter product description..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={uploading}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    Uploading Media...
                  </>
                ) : (
                  'Update Product'
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate('/admin')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </motion.button>
            </div>

            {/* Form Warning */}
            {formData.media.length === 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  ⚠️ Please upload at least one image for the product
                </p>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProduct;