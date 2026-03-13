// pages/Home.jsx
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Truck, ArrowRight, Pen } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';

const Home = () => {
  const { products, loading } = useContext(ProductContext);

  const categories = [
    {
      name: 'fashion',
      label: 'Fashion',
      description: 'Elegant clothing for every occasion',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'var(--pink)',
      textColor: 'text-pink-600',
      borderColor: 'border-pink-200',
      link: '/products/fashion', // Direct to products page
    },

    {
      name: 'earrings',
      label: 'Earrings',
      description: 'Stunning earrings to enhance your beauty',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'var(--secondary-color)',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      link: '/products/jewellery', // Goes to jewellery page with filter handled in Products component
    },
    {
      name: 'necklace',
      label: 'Neck Pieces',
      description: 'Beautiful neckpieces for every occasion',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'var(--pink)',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      link: '/products/jewellery', // Goes to jewellery page with filter handled in Products component
    },

    {
      name: 'rings',
      label: 'Rings',
      description: 'Exquisite rings to complete your look',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'var(--secondary-color)',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      link: '/products/jewellery', // Goes to jewellery page with filter handled in Products component
    },
    {
      name: 'stoles-scarves',
      label: 'Stoles & Scarves',
      description: 'Explore our unique stoles & scarves collections',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'var(--pink)',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      link: '/products/stoles-scarves', // Direct to products page
    },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Premium Quality',
      description: 'Hand-picked luxury items from around the world',
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Your data is protected with bank-level security',
    },
    {
      icon: Pen,
      title: 'Customization Available',
      description: 'Customize according to your taste',
    },
  ];

  // Get products for each category (max 4)
  const getCategoryProducts = (categoryName) => {
    if (categoryName === 'rings' || categoryName === 'necklace' || categoryName === 'earrings') {
      // For jewellery subcategories, filter by subcategory
      return products
        .filter((p) => p.category === 'jewellery' && p.subcategory === categoryName)
        .slice(0, 4);
    } else {
      // For fashion and stoles-scarves
      return products.filter((p) => p.category === categoryName).slice(0, 4);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-100">
  <div className="absolute inset-0 flex items-center justify-center" style={{backgroundColor:"var(--primary-color)"}}>
    <img src="/majestic.jpg" alt="Hero" className="w-full h-full object-contain" />
  </div>
</section>

      {/* Features Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-all"
              >
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Products Sections */}
      <section
        id="categories"
        className="py-20"
        style={{ backgroundColor: 'var(--primary-color)' }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-4 text-white"
          >
            Shop by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-200 text-center mb-12 max-w-2xl mx-auto"
          >
            Explore our carefully curated collections, each piece selected for its unique style and
            quality
          </motion.p>

          {/* Category Rows */}
          <div className="space-y-16">
            {categories.map((category, catIndex) => {
              const categoryProducts = getCategoryProducts(category.name);

              if (categoryProducts.length === 0) return null;

              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: catIndex * 0.1 }}
                  className={`rounded-2xl p-6 md:p-8`}
                  style={{ backgroundColor: `${category.bgColor}` }}
                >
                  {/* Category Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                      <h3 className={`text-2xl md:text-3xl font-bold ${category.textColor}`}>
                        {category.label}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                    </div>
                    <Link to={category.link}>
                      <motion.button
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center space-x-2 ${category.textColor} font-semibold hover:underline`}
                      >
                        <span>View All {category.label}</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {categoryProducts.map((product, idx) => {
                      const productImage =
                        product.media?.find((m) => m.isPrimary)?.url ||
                        product.media?.[0]?.url ||
                        'https://via.placeholder.com/300x300?text=No+Image';

                      return (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <Link to={`/product/${product._id}`}>
                            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                              <div className="relative aspect-square overflow-hidden">
                                <img
                                  src={productImage}
                                  alt={product.name || 'Product'}
                                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                                {product.media?.length > 1 && (
                                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                    📸 {product.media.length}
                                  </div>
                                )}
                                <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                                  ₹{product.price}
                                </div>
                              </div>
                              <div className="p-3">
                                <h4 className="font-semibold text-sm line-clamp-1">
                                  {product.name || 'Product'}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* View More Link for Mobile */}
                  <div className="mt-4 text-center md:hidden">
                    <Link to={category.link}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center space-x-2 ${category.textColor} font-semibold`}
                      >
                        <span>View More</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founder's Detailed Message Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
              {/* Header with founder name */}
              <div className="px-6 md:px-8 py-4 md:py-6"  style={{backgroundColor:"var(--primary-color)"}}>
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                  A Message From Our Founder
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-6 md:mb-8">
                  {/* Founder initial circle */}
                  <div
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
                    style={{ background: 'linear-gradient(to bottom right, #ffeeee, #ffd5d5)' }}
                  >
                    <span className="text-3xl md:text-4xl text-gray-700 font-bold">YW</span>
                  </div>

                  {/* Quick intro */}
                  <div className="text-center md:text-left">
                    <p className="font-semibold text-lg md:text-xl" style={{color:"var(--primary-color)"}}>
                      Yukti Wadhwani
                    </p>
                    <p className="text-gray-500 text-sm md:text-base">
                      Founder & Creative Director
                    </p>
                    <p className="text-xs md:text-sm text-gray-400 mt-1">Since 2022</p>
                  </div>
                </div>

                {/* Main message with quotes */}
                <div className="space-y-4 md:space-y-6 text-gray-700">
                  <div className="relative">
                    <span className="absolute -top-2 -left-2 text-4xl md:text-5xl text-green-600/20 font-serif">
                      "
                    </span>
                    <p className="text-base md:text-lg lg:text-xl leading-relaxed pl-4 md:pl-8 pr-4">
                      I started Majestic Rose in 2022 with an ambitious mindset and a vision to
                      create something truly special. My goal is simple – to provide premium
                      quality, unique designs that you won't find anywhere else, with customization
                      available to make every piece truly yours.
                    </p>
                  </div>

                  <div className="relative">
                    {/* <span className="absolute -top-2 -left-2 text-4xl md:text-5xl text-green-600/20 font-serif">"</span> */}
                    <p className="text-base md:text-lg leading-relaxed pl-4 md:pl-8 pr-4">
                      When I say premium quality, I mean it. Every piece that leaves our studio is
                      carefully crafted, inspected, and perfected.
                    </p>
                  </div>

                  <div className="relative">
                    {/* <span className="absolute -top-2 -left-2 text-4xl md:text-5xl text-green-600/20 font-serif">"</span> */}
                    <p className="text-base md:text-lg leading-relaxed pl-4 md:pl-8 pr-4">
                      What makes us different? It's the personal touch. Whether you're looking for
                      something from our collection or want a custom piece designed just for you,
                      we're here to bring your vision to life. Because at Majestic Rose, you're not
                      just a customer – you're part of our story.
                    </p>
                  </div>

                  <div className="relative">
                    {/* <span className="absolute -top-2 -left-2 text-4xl md:text-5xl text-green-600/20 font-serif">"</span> */}
                    <p className="text-base md:text-lg leading-relaxed pl-4 md:pl-8 pr-4">
                      To every woman who has trusted us, shopped with us, and believed in our dream
                      – thank you. You are the reason we wake up every morning with passion and
                      purpose.
                    </p>
                    <span className="absolute -bottom-4 right-0 text-4xl md:text-5xl text-green-600/20 font-serif">
                      "
                    </span>
                  </div>
                </div>

                {/* Signature */}
                <div className="mt-8 md:mt-10 text-right">
                  <p className="text-xl md:text-2xl font-serif text-gray-800">Yukti Wadhwani</p>
                  <p className="text-xs md:text-sm text-gray-500">Founder, Majestic Rose</p>
                </div>

                {/* Features badges */}
                <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-3 pt-4 md:pt-6 border-t border-gray-100">
                  <span className="bg-green-100 text-green-700 text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium">
                    ✨ Premium Quality
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium">
                    🎨 Unique Designs
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium">
                    ⚡ Customization Available
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
