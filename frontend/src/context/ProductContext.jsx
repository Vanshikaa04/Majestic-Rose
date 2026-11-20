// context/ProductContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Create and export the context
const ProductContext = createContext();
export { ProductContext };

// Create and export the provider
export const ProductProvider = ({ children }) => {
  const backendurl = import.meta.env.VITE_backendurl ;
  // console.log('Backend URL:', backendurl);

  const [products, setProducts] = useState([]);
  // console.log(products);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products from the database
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendurl}/api/products`);
      
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

const reorderProducts = async (category, reorderedItems) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const itemsPayload = reorderedItems.map((product, index) => ({
      id: product._id,
      order: index,
    }));

    const response = await fetch(`${backendurl}/api/reorder-products`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category,
        items: itemsPayload,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to save product order');
    }

    // Refresh products in context so Home.jsx & category pages update immediately
    await fetchProducts();
    return { success: true };
  } catch (error) {
    console.error('Error reordering products:', error);
    return { success: false, message: error.message };
  }
};

  // Fetch products by category
  const fetchProductsByCategory = async (category) => {
    try {
      setLoading(true);
      const response = await fetch(`${backendurl}/api/products/category/${category}`);
      
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
      const response = await fetch(`${backendurl}/api/products/${id}`);
      
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
    setProducts,
    reorderProducts,
    backendurl
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};