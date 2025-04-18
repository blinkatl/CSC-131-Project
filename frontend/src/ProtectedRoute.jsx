import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Helper function to decode JWT without verification
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// For routes that require any authenticated user
export const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      
      // Check if token is expired
      const decodedToken = parseJwt(token);
      if (!decodedToken) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        return;
      }
      
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        return;
      }
      
      setIsAuthenticated(true);
    };
    
    checkAuth();
  }, []);
  
  if (isAuthenticated === null) {
    // Still checking authentication status
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// For routes that require admin privileges
export const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  
  useEffect(() => {
    const checkAdminStatus = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAdmin(false);
        return;
      }
      
      // Check if token is expired and if user is admin
      const decodedToken = parseJwt(token);
      if (!decodedToken) {
        localStorage.removeItem('token');
        setIsAdmin(false);
        return;
      }
      
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        setIsAdmin(false);
        return;
      }
      
      setIsAdmin(decodedToken.administrator === true);
    };
    
    checkAdminStatus();
  }, []);
  
  if (isAdmin === null) {
    // Still checking authentication status
    return <div>Loading...</div>;
  }
  
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" />;
};