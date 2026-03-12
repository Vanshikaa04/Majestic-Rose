// pages/Jewellery.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Loader, Filter } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';

const Jewellery = () => {
  const { products, loading } = useContext(ProductContext);
  const location = useLocation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [jewelleryProducts, setJewelleryProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Get filter from URL query params on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    if (filter && ['rings', 'necklace', 'earrings'].includes(filter)) {
      setSelectedFilter(filter);
    }
  }, [location]);

  useEffect(() => {
    if (products.length > 0) {
      // Get all jewellery products (sorted by createdAt ascending - oldest first)
      const allJewellery = products
        .filter(p => p.category === 'jewellery')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      setJewelleryProducts(allJewellery);
      
      // Apply filter
      if (selectedFilter === 'all') {
        setFilteredProducts(allJewellery);
      } else {
        setFilteredProducts(allJewellery.filter(p => p.subcategory === selectedFilter));
      }
    }
  }, [products, selectedFilter]);

  const handleWhatsApp = (product) => {
    const message = encodeURIComponent(
      `Hi! I'm interested in ${product.name || 'this product'} (₹${product.price}).\n\n` +
      `Can you provide more details?`
    );
    window.open(`https://wa.me/${product.whatsappNumber?.replace('+', '') || '919979007261'}?text=${message}`, '_blank');
  };

  const filterOptions = [
    { value: 'all', label: 'All Jewellery' },
    { value: 'rings', label: 'Rings' },
    { value: 'necklace', label: 'Neck Pieces' },
    { value: 'earrings', label: 'Earrings' }
  ];

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading jewellery collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Jewellery Collection
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our exquisite collection of neckpieces, earrings, and rings crafted to perfection
          </p>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="relative inline-block">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none bg-white min-w-[200px] text-center"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-lg shadow"
          >
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-500">We couldn't find any products in this category.</p>
          </motion.div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600 text-center">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => {
                const productImage = product.media?.find(m => m.isPrimary)?.url || 
                                   product.media?.[0]?.url || 
                                   'https://via.placeholder.com/300x300?text=No+Image';
                
                const subcategoryLabels = {
                  'rings': 'Rings',
                  'necklace': 'Neck Pieces',
                  'earrings': 'Earrings'
                };

                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                  >
                    <Link to={`/product/${product._id}`}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={productImage}
                            alt={product.name || 'Jewellery'}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                          {product.media?.length > 1 && (
                            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                              📸 {product.media.length}
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                            ₹{product.price}
                          </div>
                          {product.stockStatus === 'soldout' && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                Sold Out
                              </span>
                            </div>
                          )}
                          {/* Subcategory Badge */}
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                            {subcategoryLabels[product.subcategory] || product.subcategory}
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-sm line-clamp-1">
                            {product.name || 'Jewellery Item'}
                          </h3>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              product.stockStatus === 'instock' ? 'bg-green-100 text-green-800' :
                              product.stockStatus === 'soldout' ? 'bg-red-100 text-red-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {product.stockStatus === 'instock' ? 'In Stock' :
                               product.stockStatus === 'soldout' ? 'Sold Out' :
                               'Customization'}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.preventDefault();
                                handleWhatsApp(product);
                              }}
                              className="text-green-600 hover:text-green-700"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Jewellery;