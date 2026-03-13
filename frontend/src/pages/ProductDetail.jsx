// pages/ProductDetail.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Star, 
  Truck, 
  Shield, 
  Rocket,
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  Loader,
  ArrowRight
} from 'lucide-react';
import { ProductContext } from '../context/ProductContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, loading } = useContext(ProductContext);
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [otherCategories, setOtherCategories] = useState([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define all categories
  const allCategories = [
    { name: 'fashion', label: 'Fashion', icon: '👗', color: 'from-pink-500 to-rose-500', bgColor: 'var(--pink)', textColor: 'text-pink-600' },
    { name: 'jewellery', label: 'Jewellery', icon: '💎', color: 'from-purple-500 to-indigo-500', bgColor: 'var(--white)', textColor: 'text-purple-600' },
    { name: 'stoles-scarves', label: 'Stoles & Scarves', icon: '🧣', color: 'from-amber-500 to-orange-500', bgColor: 'var(--pink)', textColor: 'text-amber-600' }
  ];

  useEffect(() => {
    if (products.length > 0) {
      // Find current product
      const found = products.find(p => p._id === id);
      setProduct(found);
      
      if (found) {
        // Get recommended products (same category, excluding current)
        const sameCategory = products
          .filter(p => p.category === found.category && p._id !== id)
          .slice(0, 4);
        
        // If less than 4 from same category, add from other categories
        if (sameCategory.length < 4) {
          const otherCategoriesProducts = products
            .filter(p => p.category !== found.category)
            .slice(0, 4 - sameCategory.length);
          
          setRecommendedProducts([...sameCategory, ...otherCategoriesProducts]);
        } else {
          setRecommendedProducts(sameCategory);
        }

        // Get other categories (excluding current)
        const others = allCategories.filter(c => c.name !== found.category);
        setOtherCategories(others);
      }
    }
  }, [products, id]);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in ${product.name || 'this product'} (₹${product.price}).\n\n` +
      `Can you provide more details?`
    );
    window.open(`https://wa.me/${product?.whatsappNumber?.replace('+', '') || '919979007261'}?text=${message}`, '_blank');
  };

  const nextMedia = () => {
    setSelectedMediaIndex((prev) => 
      prev === product.media.length - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setSelectedMediaIndex((prev) => 
      prev === 0 ? product.media.length - 1 : prev - 1
    );
  };

  // Get products for other categories
  const getCategoryProducts = (categoryName) => {
    if (categoryName === 'jewellery') {
      // For jewellery, show products from all subcategories
      return products
        .filter(p => p.category === 'jewellery')
        .slice(0, 4);
    }
    return products
      .filter(p => p.category === categoryName)
      .slice(0, 4);
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin  mx-auto mb-4" style={{color: "var(--primary-color)"}} />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3  rounded-lg font-semibold"
              style={{ backgroundColor: 'var(--primary-color)', color: 'var(--pink)' }}
            >
              Back to Home
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const currentMedia = product.media?.[selectedMediaIndex] || { type: 'image', url: 'https://via.placeholder.com/800x800' };
  const features = [
    { icon: Truck, text: 'Delivery within 7-15 business days after Dispatch' },
    { icon: Shield, text: "Free shipping on orders over ₹5000" },
    { icon: Rocket, text: "Shipping Pan India" },
  ];

  // Get stock status display
  const getStockStatus = () => {
    switch(product.stockStatus) {
      case 'instock':
        return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
      case 'soldout':
        return { text: 'Sold Out', color: 'bg-red-100 text-red-800' };
      case 'customization':
        return { text: 'Customization Available', color: 'bg-purple-100 text-purple-800' };
      default:
        return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => window.history.back()}
          className="mb-4 md:mb-6 flex items-center text-gray-600 hover:text-green-600 transition"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Back</span>
        </motion.button>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 mb-12 md:mb-16">
          {/* Media Gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[3/4] md:aspect-auto md:h-[500px] rounded-xl overflow-hidden mb-3 md:mb-4 cursor-pointer shadow-lg"
              onClick={() => setIsModalOpen(true)}
            >
              {currentMedia.type === 'video' ? (
                <video 
                  src={currentMedia.url} 
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={currentMedia.url}
                  alt={product.name || 'Product'}
                  className="w-full h-full object-cover"
                />
              )}

              {currentMedia.type === 'video' && (
                <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-black bg-opacity-50 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm">
                  Video
                </div>
              )}

              {product.media?.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                    className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-1.5 md:p-2 transition"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                    className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-1.5 md:p-2 transition"
                  >
                    <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.media?.length > 1 && (
              <div className="grid grid-cols-6 gap-1 md:gap-2">
                {product.media.map((media, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                      selectedMediaIndex === index ? 'border-green-600' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedMediaIndex(index)}
                  >
                    {media.type === 'video' ? (
                      <>
                        <video src={media.url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <Play className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={media.url}
                        alt={`${product.name || ' Product'} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-4 md:p-8 shadow-lg"
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{product.name || ''}</h1>
              <span className={`px-3 py-1 rounded-full text-xs md:text-sm capitalize whitespace-nowrap ${stockStatus.color}`}>
                {stockStatus.text}
              </span>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 md:w-5 md:h-5 ${i < 4 ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="ml-2 text-xs md:text-sm text-gray-600">(128 reviews)</span>
            </div>

            <p className="text-2xl md:text-3xl font-bold  mb-4 md:mb-6"   style={{ color: 'var(--primary-color)' }}>₹{product.price}</p>
            
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 leading-relaxed">{product.description}</p>

            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-gray-600">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWhatsApp}
              className="w-full py-3 md:py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 md:space-x-3 text-sm md:text-lg hover:bg-green-600 transition shadow-lg"
                style={{ backgroundColor: 'var(--primary-color)', color: 'var(--pink)' }}
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
              <span>Contact via WhatsApp for Purchase</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Recommended Products Section */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12 md:mt-16 mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 md:mb-4">You May Also Like</h2>
            <p className="text-sm md:text-base text-gray-600 text-center mb-6 md:mb-8">Discover similar products from our collection</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {recommendedProducts.map((recProduct, index) => {
                const recImage = recProduct.media?.[0]?.url || 'https://via.placeholder.com/300x300';
                
                return (
                  <motion.div
                    key={recProduct._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Link to={`/product/${recProduct._id}`}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={recImage}
                            alt={recProduct.name || 'Product'}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-2 right-2 bg-green-600 text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[10px] md:text-xs">
                            ₹{recProduct.price}
                          </div>
                        </div>
                        <div className="p-2 md:p-4">
                          <h3 className="font-semibold text-xs md:text-sm mb-1 line-clamp-1 hover:text-green-600 transition">
                            {recProduct.name || 'Product'}
                          </h3>
                          <p className="text-[10px] md:text-xs text-gray-500 capitalize">{recProduct.category}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Other Categories Section */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 md:mb-4">Explore Other Categories</h2>
          <p className="text-sm md:text-base text-gray-600 text-center mb-6 md:mb-8">Discover more from our collection</p>

          <div className="space-y-8 md:space-y-12">
            {otherCategories.map((otherCat, catIndex) => {
              const categoryProducts = getCategoryProducts(otherCat.name);
              
              if (categoryProducts.length === 0) return null;

              return (
                <motion.div
                  key={otherCat.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: catIndex * 0.2 }}
                  className={` rounded-xl md:rounded-2xl p-4 md:p-6`}
                  style={{ backgroundColor: otherCat.bgColor }}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      {/* <span className="text-2xl md:text-3xl">{otherCat.icon}</span> */}
                      <h3 className={`text-xl md:text-2xl font-bold ${otherCat.textColor}`}>
                        {otherCat.label}
                      </h3>
                    </div>
                    <Link to={`/products/${otherCat.name}`}>
                      <motion.button
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center space-x-1 md:space-x-2 ${otherCat.textColor} text-sm md:text-base font-semibold hover:underline`}
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                      </motion.button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {categoryProducts.map((product, idx) => {
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
                            <div className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                              <div className="relative aspect-square overflow-hidden">
                                <img
                                  src={productImage}
                                  alt={product.name || 'Product'}
                                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-green-600 text-white px-1 py-0.5 md:px-2 md:py-1 rounded text-[8px] md:text-xs font-bold">
                                  ₹{product.price}
                                </div>
                              </div>
                              <div className="p-2 md:p-3">
                                <h4 className="font-semibold text-[10px] md:text-sm line-clamp-1">{product.name || 'Product'}</h4>
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

      {/* Fullscreen Media Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center p-2 md:p-4" onClick={(e) => e.stopPropagation()}>
              {currentMedia.type === 'video' ? (
                <video 
                  src={currentMedia.url} 
                  className="max-w-full max-h-[90vh]"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={currentMedia.url}
                  alt={product.name || 'Product'}
                  className="max-w-full max-h-[90vh] object-contain"
                />
              )}

              {product.media?.length > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 md:p-3"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={nextMedia}
                    className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 md:p-3"
                  >
                    <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;