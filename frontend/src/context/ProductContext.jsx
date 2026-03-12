// context/ProductContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Create and export the context
export const ProductContext = createContext();

// Create and export the provider
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products from the database
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products by category
  const fetchProductsByCategory = async (category) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/category/${category}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get single product by ID
  const getProductById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.message);
      return null;
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Context value
  const value = {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductsByCategory,
    getProductById,
    setProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};