// pages/Products.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, MessageCircle, Loader, ArrowRight } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { products, loading: contextLoading } = useContext(ProductContext);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [otherCategories, setOtherCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jewellerySubFilter, setJewellerySubFilter] = useState('all');

  // Define all categories
  const allCategories = [
    { name: 'fashion', label: 'Fashion', color: 'from-pink-500 to-rose-500' },
    { name: 'jewellery', label: 'Jewellery', color: 'from-purple-500 to-indigo-500' },
    { name: 'stoles-scarves', label: 'Stoles & Scarves', color: 'from-amber-500 to-orange-500' }
  ];

  // Jewellery subcategories for filter
  const jewelleryFilters = [
    { value: 'all', label: 'All Jewellery' },
    { value: 'rings', label: 'Rings' },
    { value: 'necklace', label: 'Neck Pieces' },
    { value: 'earrings', label: 'Earrings' }
  ];

  useEffect(() => {
    if (products && products.length > 0) {
      let filtered = [];
      
      if (category === 'jewellery') {
        // For jewellery, get all jewellery products sorted by createdAt ascending (oldest first)
        filtered = products
          .filter(p => p.category === 'jewellery')
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setCategoryProducts(filtered);
        
        // Apply subcategory filter if not 'all'
        if (jewellerySubFilter !== 'all') {
          setFilteredProducts(filtered.filter(p => p.subcategory === jewellerySubFilter));
        } else {
          setFilteredProducts(filtered);
        }
      } else {
        // For other categories, sort by createdAt ascending (oldest first)
        filtered = products
          .filter(p => p.category === category)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setCategoryProducts(filtered);
        setFilteredProducts(filtered);
      }
      
      // Get other categories (excluding current)
      const others = allCategories.filter(c => c.name !== category);
      setOtherCategories(others);
      
      setLoading(false);
    }
  }, [products, category, jewellerySubFilter]);

  const handleWhatsApp = (product) => {
    const message = encodeURIComponent(
      `Hi! I'm interested in ${product.name || 'this product'} (₹${product.price}).\n\n` +
      `Can you provide more details?`
    );
    window.open(`https://wa.me/${product.whatsappNumber?.replace('+', '') || '919979007261'}?text=${message}`, '_blank');
  };

  // Get products for other categories (4 each) - For other categories section, we want latest 4
  const getOtherCategoryProducts = (categoryName) => {
    return products
      .filter(p => p.category === categoryName)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Latest first for other categories
      .slice(0, 4);
  };

  const handleSubFilterChange = (filter) => {
    setJewellerySubFilter(filter);
  };

  const getCategoryDisplayName = () => {
    if (category === 'jewellery') {
      const filter = jewelleryFilters.find(f => f.value === jewellerySubFilter);
      return filter ? filter.label : 'Jewellery';
    }
    return category;
  };

  if (loading || contextLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Use filteredProducts for display (for jewellery it respects subfilter, for others it's same as categoryProducts)
  const displayProducts = category === 'jewellery' ? filteredProducts : categoryProducts;

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold capitalize mb-4 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            {category === 'jewellery' ? 'Jewellery Collection' : category}
          </h1>
          <p className="text-gray-600 text-lg">
            {category === 'jewellery' 
              ? 'Discover our exquisite collection of neckpieces, earrings, and rings'
              : `Discover our exclusive ${category} collection`}
          </p>
        </motion.div>

        {/* Jewellery Subcategory Filter - Only show for jewellery */}
        {category === 'jewellery' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {jewelleryFilters.map((filter) => (
                <motion.button
                  key={filter.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSubFilterChange(filter.value)}
                  className={`px-4 py-2 rounded-full capitalize transition-all ${
                    jewellerySubFilter === filter.value
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products Grid - Updated for mobile: 2 columns with full height images */}
        {displayProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-lg shadow mb-12"
          >
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-500">We couldn't find any products in this category.</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-16"
            >
              <AnimatePresence>
                {displayProducts.map((product, index) => {
                  const primaryImage = product.media?.find(m => m.isPrimary)?.url || 
                                      product.media?.[0]?.url || 
                                      'https://via.placeholder.com/400x400?text=No+Image';
                  
                  return (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col h-full"
                    >
                      <Link to={`/product/${product._id}`} className="flex flex-col h-full">
                        {/* Image Container - Full height on mobile */}
                        <div className="relative w-full aspect-[3/4] md:aspect-square overflow-hidden bg-gray-100">
                          <img
                            src={primaryImage}
                            alt={product.name || 'Product'}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          
                          {product.media?.length > 1 && (
                            <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-1.5 py-0.5 rounded text-[10px] md:text-xs backdrop-blur-sm">
                              📸 {product.media.length}
                            </div>
                          )}

                          {/* Category/Subcategory Badge - Adjusted for mobile */}
                          <div className="absolute top-2 right-2 bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                            {product.category === 'jewellery' ? product.subcategory : product.category === 'stoles-scarves' ? 'Stoles' : product.category}
                          </div>

                          {/* Price Badge - Adjusted for mobile */}
                          <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 backdrop-blur-sm text-green-600 px-1.5 py-0.5 rounded text-xs md:text-sm font-bold shadow-lg">
                            ₹{product.price}
                          </div>
                        </div>

                        <div className="p-2 md:p-4 flex flex-col flex-grow">
                          <h3 className="font-semibold text-xs md:text-lg mb-1 hover:text-green-600 transition line-clamp-1">
                            {product.name || 'Product'}
                          </h3>
                          
                          <p className="text-gray-500 text-[10px] md:text-sm mb-2 line-clamp-2 md:line-clamp-2 flex-grow">
                            {product.description}
                          </p>
                        </div>
                      </Link>

                      {/* WhatsApp Button - Adjusted for mobile */}
                      <div className="px-2 pb-2 md:px-4 md:pb-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleWhatsApp(product)}
                          className="w-full bg-green-500 text-white py-1.5 md:py-2.5 rounded-lg text-[10px] md:text-sm font-semibold flex items-center justify-center space-x-1 md:space-x-2 hover:bg-green-600 transition shadow-md"
                        >
                          <MessageCircle className="w-3 h-3 md:w-5 md:h-5" />
                          <span className="hidden md:inline">Contact on WhatsApp</span>
                          <span className="md:hidden">WhatsApp</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Results Count */}
            <div className="text-center text-gray-500 text-xs md:text-sm mb-12">
              Showing {displayProducts.length} product{displayProducts.length > 1 ? 's' : ''} in {getCategoryDisplayName()}
            </div>
          </>
        )}

        {/* Other Categories Section */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Explore Other Categories</h2>
          <p className="text-gray-600 text-sm md:text-base text-center mb-8 md:mb-12">Discover more from our collection</p>

          <div className="space-y-12 md:space-y-16">
            {otherCategories.map((otherCat, catIndex) => {
              const otherProducts = getOtherCategoryProducts(otherCat.name);
              
              if (otherProducts.length === 0) return null;

              return (
                <motion.div
                  key={otherCat.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: catIndex * 0.2 }}
                  className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold">
                        <span className={`bg-gradient-to-r ${otherCat.color} bg-clip-text text-transparent`}>
                          {otherCat.label}
                        </span>
                      </h3>
                      <p className="text-gray-500 text-xs md:text-sm mt-1">
                        {otherProducts.length} products available
                      </p>
                    </div>
                    <Link to={`/products/${otherCat.name}`}>
                      <motion.button
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-1 md:space-x-2 text-green-600 text-sm md:text-base font-semibold hover:text-green-700"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                      </motion.button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                    {otherProducts.map((product, idx) => {
                      const productImage = product.media?.[0]?.url || 'https://via.placeholder.com/200x200';
                      
                      return (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <Link to={`/product/${product._id}`}>
                            <div className="relative group cursor-pointer">
                              <div className="aspect-square rounded-lg overflow-hidden">
                                <img
                                  src={productImage}
                                  alt={product.name || 'Product'}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg"></div>
                              <div className="absolute bottom-1 left-1 right-1 md:bottom-2 md:left-2 md:right-2">
                                <p className="text-[10px] md:text-sm font-semibold text-white drop-shadow-lg line-clamp-1">
                                  {product.name || 'Product'}
                                </p>
                                <p className="text-[8px] md:text-xs text-white font-bold">₹{product.price}</p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;