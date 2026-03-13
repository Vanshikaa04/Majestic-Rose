// pages/AdminDashboard.jsx
import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Package,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  Loader,
  Star,
  Filter,
  RefreshCw,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { ProductContext } from '../context/ProductContext';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { products, fetchProducts, loading, uploadMedia, deleteMedia } = useContext(ProductContext);
  const { logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const { backendurl } = useContext(ProductContext);

  const stockStatusStyles = {
    instock: 'bg-green-100 text-green-800',
    soldout: 'bg-red-100 text-red-800',
    customization: 'bg-purple-100 text-purple-800'
  };

  const stockStatusLabels = {
    instock: 'In Stock',
    soldout: 'Sold Out',
    customization: 'Customization Available'
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'jewellery', label: 'All Jewellery' },
    { value: 'necklace', label: 'Necklace' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'rings', label: 'Rings' },
    { value: 'stoles-scarves', label: 'Stoles & Scarves' }
  ];

  // Theme colors
  const primaryColor = '#0B2C33';
  const pinkColor = '#ffeeee';

  // Filter products by search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.subcategory?.toLowerCase().includes(searchTerm.toLowerCase())));

    let matchesCategory = true;
    
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'jewellery') {
        matchesCategory = product.category === 'jewellery';
      } else if (['necklace', 'earrings', 'rings'].includes(selectedCategory)) {
        matchesCategory = product.subcategory === selectedCategory;
      } else {
        matchesCategory = product.category === selectedCategory;
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setIsRefreshing(false);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendurl}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        await fetchProducts();
      } else {
        alert('Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category' && value !== 'jewellery') {
      setSelectedProduct(prev => ({
        ...prev,
        [name]: value,
        subcategory: null
      }));
    } else {
      setSelectedProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle adding new images
  const handleAddImages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      files.forEach(file => formData.append('media', file));

      const response = await fetch(`${backendurl}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      const uploadedMedia = await response.json();

      setSelectedProduct(prev => ({
        ...prev,
        media: [...prev.media, ...uploadedMedia]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  // Handle removing an image
  const handleRemoveImage = async (mediaItem) => {
    if (!window.confirm('Remove this image?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${backendurl}/api/delete-media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ publicId: mediaItem.publicId, type: 'image' })
      });

      setSelectedProduct(prev => ({
        ...prev,
        media: prev.media.filter(m => m.publicId !== mediaItem.publicId)
      }));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  // Handle setting primary image
  const handleSetPrimary = (index) => {
    setSelectedProduct(prev => ({
      ...prev,
      media: prev.media.map((m, i) => ({ ...m, isPrimary: i === index }))
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    if (selectedProduct.category === 'jewellery' && !selectedProduct.subcategory) {
      alert('Please select a subcategory for jewellery');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const updateData = {
        category: selectedProduct.category,
        price: Number(selectedProduct.price),
        description: selectedProduct.description,
        media: selectedProduct.media,
        whatsappNumber: selectedProduct.whatsappNumber,
        stockStatus: selectedProduct.stockStatus
      };

      if (selectedProduct.name && selectedProduct.name.trim()) {
        updateData.name = selectedProduct.name.trim();
      }

      if (selectedProduct.category === 'jewellery') {
        updateData.subcategory = selectedProduct.subcategory;
      }

      const response = await fetch(`${backendurl}/api/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const responseData = await response.json();

      if (response.ok) {
        await fetchProducts();
        setIsEditModalOpen(false);
        setSelectedProduct(null);
        alert('Product updated successfully!');
      } else {
        console.error('Server error:', responseData);
        alert(responseData.message || 'Error updating product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert(error.message || 'Error updating product');
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryDisplay = (product) => {
    if (product.category === 'jewellery' && product.subcategory) {
      const subcategoryLabels = {
        'necklace': 'Necklace',
        'earrings': 'Earrings',
        'rings': 'Rings'
      };
      return `Jewellery - ${subcategoryLabels[product.subcategory] || product.subcategory}`;
    }
    
    const labels = {
      'fashion': 'Fashion',
      'jewellery': 'Jewellery',
      'stoles-scarves': 'Stoles & Scarves'
    };
    return labels[product.category] || product.category;
  };

  const getDisplayName = (product) => {
    return product.name || 'Unnamed Product';
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: primaryColor }}></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8" style={{ color: primaryColor }} />
              <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>Product Management</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ focus: { ringColor: primaryColor } }}
                  onFocus={(e) => e.target.classList.add('focus:ring-[#0B2C33]')}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="relative flex-1 md:w-56">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C33] appearance-none bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center justify-center space-x-2 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </motion.button>

              {/* Add Product Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/add-product')}
                className="flex items-center justify-center space-x-2 text-white px-4 py-2 rounded-lg transition"
                style={{ backgroundColor: primaryColor }}
              >
                <Plus className="w-5 h-5" />
                <span>Add Product</span>
              </motion.button>
              
              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: primaryColor }}>{products.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                {products.filter(p => p.category === 'fashion').length}
              </p>
              <p className="text-sm text-gray-600">Fashion</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                {products.filter(p => p.category === 'jewellery').length}
              </p>
              <p className="text-sm text-gray-600">All Jewellery</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                {products.filter(p => p.subcategory === 'necklace').length}
              </p>
              <p className="text-sm text-gray-600">Necklace</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                {products.filter(p => p.subcategory === 'earrings').length}
              </p>
              <p className="text-sm text-gray-600">Earrings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                {products.filter(p => p.subcategory === 'rings').length}
              </p>
              <p className="text-sm text-gray-600">Rings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                {products.filter(p => p.category === 'stoles-scarves').length}
              </p>
              <p className="text-sm text-gray-600">Stoles & Scarves</p>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg shadow"
          >
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-4 hover:underline"
                style={{ color: primaryColor }}
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product, index) => {
                const primaryImage = product.media?.find(m => m.isPrimary)?.url || 
                                    product.media?.[0]?.url || 
                                    'https://via.placeholder.com/400x400?text=No+Image';
                
                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={primaryImage}
                        alt={getDisplayName(product)}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      
                      {product.media?.find(m => m.isPrimary) && (
                        <div className="absolute top-2 left-2 p-1 rounded-full" style={{ backgroundColor: primaryColor }}>
                          <Star className="w-3 h-3 text-white" />
                        </div>
                      )}

                      {product.media?.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                          📸 {product.media.length}
                        </div>
                      )}

                      <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold text-white" style={{ backgroundColor: primaryColor }}>
                        {getCategoryDisplay(product)}
                      </div>
                    </div>

                    <div className="p-3 lg:p-4">
                      <h3 className="font-semibold text-sm lg:text-base mb-1 line-clamp-1">
                        {getDisplayName(product)}
                      </h3>
                      
                      <p className="text-base lg:text-lg font-bold mb-2" style={{ color: primaryColor }}>
                        ₹{product.price}
                      </p>
                      
                      <div className="hidden lg:block mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stockStatusStyles[product.stockStatus]}`}>
                          {stockStatusLabels[product.stockStatus]}
                        </span>
                      </div>

                      <div className="lg:hidden mb-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          product.stockStatus === 'instock' ? 'bg-green-500' :
                          product.stockStatus === 'soldout' ? 'bg-red-500' : 'bg-purple-500'
                        }`} title={stockStatusLabels[product.stockStatus]}></span>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleEdit(product)}
                          className="flex-1 flex items-center justify-center space-x-1 bg-blue-500 text-white py-2 px-2 rounded text-sm hover:bg-blue-600 transition"
                        >
                          <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="text-xs lg:text-sm">Edit</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDelete(product._id)}
                          disabled={isDeleting}
                          className="flex-1 flex items-center justify-center space-x-1 bg-red-500 text-white py-2 px-2 rounded text-sm hover:bg-red-600 transition disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <Loader className="w-3 h-3 lg:w-4 lg:h-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                              <span className="text-xs lg:text-sm">Delete</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal with Image Management */}
      <AnimatePresence>
        {isEditModalOpen && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => !isSaving && setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>Edit Product</h2>
                  <button
                    onClick={() => !isSaving && setIsEditModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit}>
                  {/* Image Management Section */}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold">Product Images</label>
                    
                    {/* Existing Images Grid */}
                    {selectedProduct.media && selectedProduct.media.length > 0 && (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                        {selectedProduct.media.map((media, idx) => (
                          <div key={idx} className="relative group">
                            <div className={`aspect-square rounded-lg overflow-hidden border-2 ${
                              media.isPrimary ? 'border-2' : 'border-gray-200'
                            }`} style={media.isPrimary ? { borderColor: primaryColor } : {}}>
                              <img src={media.url} className="w-full h-full object-cover" />
                            </div>
                            
                            {/* Primary star */}
                            {media.isPrimary && (
                              <div className="absolute top-1 right-1 p-1 rounded-full" style={{ backgroundColor: primaryColor }}>
                                <Star className="w-3 h-3 text-white" />
                              </div>
                            )}

                            {/* Action buttons */}
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                              {!media.isPrimary && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimary(idx)}
                                  className="p-1.5 bg-white rounded-full hover:bg-gray-100"
                                  title="Set as primary"
                                >
                                  <Star className="w-4 h-4" style={{ color: primaryColor }} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(media)}
                                className="p-1.5 bg-red-500 rounded-full hover:bg-red-600"
                                title="Remove image"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Images Button */}
                    <div className="mt-3">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAddImages}
                        className="hidden"
                        id="image-upload"
                        disabled={uploadingImages}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition ${
                          uploadingImages ? 'opacity-50 cursor-not-allowed' : ''
                        } text-white`}
                        style={{ backgroundColor: primaryColor }}
                      >
                        {uploadingImages ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span>{uploadingImages ? 'Uploading...' : 'Add More Images'}</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">You can upload multiple images at once</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-semibold">Main Category</label>
                    <select
                      name="category"
                      value={selectedProduct.category}
                      onChange={handleEditFieldChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C33]"
                    >
                      <option value="fashion">Fashion</option>
                      <option value="jewellery">Jewellery</option>
                      <option value="stoles-scarves">Stoles & Scarves</option>
                    </select>
                  </div>

                  {/* Subcategory - Only for Jewellery */}
                  {selectedProduct.category === 'jewellery' && (
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-semibold">
                        Subcategory <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="subcategory"
                        value={selectedProduct.subcategory || ''}
                        onChange={handleEditFieldChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C33]"
                      >
                        <option value="">Select subcategory</option>
                        <option value="necklace">Necklace</option>
                        <option value="earrings">Earrings</option>
                        <option value="rings">Rings</option>
                      </select>
                      {!selectedProduct.subcategory && (
                        <p className="text-xs text-red-500 mt-1">Subcategory is required for jewellery items</p>
                      )}
                    </div>
                  )}

                  {/* Name */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-semibold">
                      {selectedProduct.category === 'fashion' ? 'Product Name' : 'Name (Optional)'}
                      {selectedProduct.category === 'fashion' && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={selectedProduct.name || ''}
                      onChange={handleEditFieldChange}
                      required={selectedProduct.category === 'fashion'}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C33]"
                      placeholder={selectedProduct.category === 'fashion' ? "Enter product name" : "Enter name (optional)"}
                    />
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-semibold">Price (₹) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="price"
                      value={selectedProduct.price}
                      onChange={handleEditFieldChange}
                      required
                      min="0"
                      step="1"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C33]"
                    />
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-semibold">Stock Status <span className="text-red-500">*</span></label>
                    <select
                      name="stockStatus"
                      value={selectedProduct.stockStatus}
                      onChange={handleEditFieldChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C33]"
                    >
                      <option value="instock">In Stock</option>
                      <option value="soldout">Sold Out</option>
                      <option value="customization">Customization Available</option>
                    </select>
                  </div>

                  {/* WhatsApp Number */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-semibold">WhatsApp Number <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="whatsappNumber"
                      value={selectedProduct.whatsappNumber}
                      onChange={handleEditFieldChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C33]"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold">Description <span className="text-red-500">*</span></label>
                    <textarea
                      name="description"
                      value={selectedProduct.description}
                      onChange={handleEditFieldChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C33]"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSaving || uploadingImages}
                      className="flex-1 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {isSaving ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      disabled={isSaving}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;