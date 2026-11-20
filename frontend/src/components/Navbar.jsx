// components/Navbar.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Menu,
  X,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

// Update path if your rose asset has a different filename (e.g., rose.png, rose.jpeg, rose.svg)
import logoImg from '../assets/majestic.jpg';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Fashion', path: '/products/fashion' },
    { name: 'Jewellery', path: '/products/jewellery' },
    { name: 'Stoles & Scarves', path: '/products/stoles-scarves' },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md py-2.5 border-b border-pink-100'
          : 'bg-white/95 backdrop-blur-sm py-3.5 border-b border-pink-50'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          {/* Brand Logo matching Home.jsx serif & color theme */}
          <Link to="/" className="group flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm border border-pink-100 overflow-hidden flex-shrink-0"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              <img
                src={logoImg}
                alt="Majestic Rose"
                className="w-8 h-8 object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>

            <div className="flex flex-col">
              <span
                className="font-serif text-xl md:text-2xl font-bold tracking-tight leading-none transition-opacity group-hover:opacity-90"
                style={{ color: 'var(--primary-color)' }}
              >
                Majestic Rose
              </span>
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-500 mt-1 font-medium">
                Fashion Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative py-1.5 text-sm font-medium tracking-wide transition-colors"
                  style={{
                    color: isActive ? 'var(--primary-color)' : '#4b5563',
                  }}
                >
                  <motion.span
                    whileHover={{ y: -1 }}
                    className={`inline-block transition-colors hover:text-gray-900 ${
                      isActive ? 'font-semibold' : ''
                    }`}
                  >
                    {item.name}
                  </motion.span>

                  {/* Animated active indicator pill */}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-indicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute bottom-0 inset-x-0 h-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--primary-color)' }}
                    />
                  )}
                </Link>
              );
            })}

            {isAuthenticated && (
              <Link
                to="/admin"
                className="relative py-1.5 text-sm font-medium tracking-wide text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span>Admin</span>
                {location.pathname === '/admin' && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute bottom-0 inset-x-0 h-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  />
                )}
              </Link>
            )}
          </div>

          {/* Desktop Right Action Pill */}
          <div className="hidden md:flex items-center gap-3">
            <Link to={isAuthenticated ? '/admin' : '/login'}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold shadow-sm border transition-all"
                style={{
                  backgroundColor: 'var(--pink)',
                  color: 'var(--primary-color)',
                  borderColor: 'rgba(0,0,0,0.05)',
                }}
              >
                <User className="w-3.5 h-3.5" />
                <span>{isAuthenticated ? 'Dashboard' : 'Account'}</span>
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center border border-pink-100 shadow-sm transition-colors"
            style={{
              backgroundColor: isOpen ? 'var(--primary-color)' : 'var(--pink)',
              color: isOpen ? '#ffffff' : 'var(--primary-color)',
            }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="md:hidden mt-3 bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden"
            >
              <div className="p-3 space-y-1">
                {navLinks.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.name} to={item.path} className="block">
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-between px-4 py-3 rounded-2xl transition-colors"
                        style={
                          isActive
                            ? {
                                backgroundColor: 'var(--pink)',
                                color: 'var(--primary-color)',
                              }
                            : { color: '#374151' }
                        }
                      >
                        <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>
                          {item.name}
                        </span>
                        <ArrowUpRight
                          className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-30'}`}
                        />
                      </motion.div>
                    </Link>
                  );
                })}

                <div className="my-2 border-t border-pink-50" />

                {/* Account / Admin Action */}
                <Link to={isAuthenticated ? '/admin' : '/login'} className="block">
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl text-white font-semibold text-sm shadow-md"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <User className="w-4 h-4" />
                      {isAuthenticated ? 'Admin Dashboard' : 'Login / Account'}
                    </span>
                    <Sparkles className="w-4 h-4 opacity-80" />
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