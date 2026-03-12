// context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Create and export the context
export const AuthContext = createContext();

// Create and export the provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const adminData = localStorage.getItem('admin');
    
    if (token && adminData) {
      try {
        // Verify token with backend
        const response = await fetch('http://localhost:5000/api/admin/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
          setAdmin(JSON.parse(adminData));
        } else {
          // Token invalid
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    }
    setLoading(false);
  };

  const login = (token, adminData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(adminData));
    setIsAuthenticated(true);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setIsAuthenticated(false);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};