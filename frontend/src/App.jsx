// App.js (your existing file - no changes needed)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products/:category" element={<Products />} /> {/* This handles /products/jewellery */}
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/add-product" element={
                    <ProtectedRoute>
                      <AddProduct />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/edit-product/:id" element={
                    <ProtectedRoute>
                      <EditProduct />
                    </ProtectedRoute>
                  } />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;