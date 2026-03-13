// components/Navbar.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Menu, 
  X, 
  Gem,
  Sparkles,
  Heart,
  Crown
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Fashion', path: '/products/fashion' },
  ];

  const jewellerySubcategories = [
    { name: 'All Jewellery', path: '/products/jewellery', icon: Gem },
    { name: 'Necklace', path: '/products/necklace', icon: Sparkles },
    { name: 'Earrings', path: '/products/earrings', icon: Heart },
    { name: 'Rings', path: '/products/rings', icon: Crown },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
        
      }`}
      style={{backgroundColor:"var(--primary-color)"}}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo with Brand Name */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex flex-col">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-xl md:text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent leading-tight"
                style={{color:"var(--pink)"}}
              >
                Majestic Rose
              </motion.span>
              <span className="text-xs text-white italic">Fashion Studio</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Home & Fashion - Direct Links */}
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`cursor-pointer ${
                    location.pathname === item.path
                      ? 'text-yellow-200 font-semibold'
                      : 'text-gray-400 hover:text-yellow-200'
                  }`}
                >
                  <span>{item.name}</span>
                </motion.div>
              </Link>
            ))}

            {/* Jewellery Link */}
            <Link to="/products/jewellery">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`cursor-pointer ${
                  location.pathname === '/products/jewellery'
                    ? 'text-yellow-200 font-semibold'
                    :  'text-gray-400 hover:text-yellow-200'
                }`}
              >
                <span>Jewellery</span>
              </motion.div>
            </Link>

            {/* Stoles & Scarves Link */}
            <Link to="/products/stoles-scarves">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`cursor-pointer ${
                  location.pathname === '/products/stoles-scarves'
                    ? 'text-yellow-200 font-semibold'
                    :  'text-gray-400 hover:text-yellow-200'
                }`}
              >
                <span>Stoles & Scarves</span>
              </motion.div>
            </Link>
            
            {/* Admin Link (Desktop) */}
            {isAuthenticated && (
              <Link to="/admin">
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="cursor-pointer text-gray-400 hover:text-yellow-200 font-medium"
                >
                  Admin
                </motion.span>
              </Link>
            )}
          </div>

          {/* Desktop Right Icons -only user remains */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to={isAuthenticated ? '/admin' : '/login'}>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <User className="w-6 h-6 text-gray-400 hover:text-yellow-200" />
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg  transition-colors text-white "
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="py-2">
                {/* Home & Fashion */}
                {navItems.map((item) => (
                  <Link key={item.name} to={item.path}>
                    <motion.div
                      whileHover={{ x: 10 }}
                      className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                        location.pathname === item.path ? 'bg-green-50 text-green-600 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{item.name}</span>
                    </motion.div>
                  </Link>
                ))}

                {/* Jewellery Main Link */}
                <Link to="/products/jewellery">
                  <motion.div
                    whileHover={{ x: 10 }}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                      location.pathname === '/products/jewellery' ? 'bg-green-50 text-green-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span className="font-medium">Jewellery</span>
                  </motion.div>
                </Link>

      

                {/* Stoles & Scarves */}
                <div className="border-gray-100 my-2"></div>
                <Link to="/products/stoles-scarves">
                  <motion.div
                    whileHover={{ x: 10 }}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                      location.pathname === '/products/stoles-scarves' ? 'bg-green-50 text-green-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span className="font-medium">Stoles & Scarves</span>
                  </motion.div>
                </Link>

                {/* Admin Link (Mobile) */}
                {isAuthenticated && (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link to="/admin">
                      <motion.div
                        whileHover={{ x: 10 }}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Admin Dashboard</span>
                      </motion.div>
                    </Link>
                  </>
                )}

                {/* Mobile Login Link (instead of cart) */}
                <div className="border-t border-gray-200 my-2"></div>
                <Link to={isAuthenticated ? '/admin' : '/login'} className="block">
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">
                      {isAuthenticated ? 'Admin Dashboard' : 'Login'}
                    </span>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;