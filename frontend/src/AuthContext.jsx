import React, { createContext, useState, useEffect, useContext } from 'react';

// Helper function to decode JWT without verification
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if there's a stored token on page load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }
      
      // Check if token is expired
      const decodedToken = parseJwt(token);
      if (!decodedToken) {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setLoading(false);
        return;
      }
      
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setLoading(false);
        return;
      }
      
      // Set the current user from the token
      setCurrentUser({
        username: decodedToken.username,
        isAdmin: decodedToken.administrator
      });
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedToken = parseJwt(token);
    setCurrentUser({
      username: decodedToken.username,
      isAdmin: decodedToken.administrator
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Get auth token for API requests
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    getAuthHeader
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};