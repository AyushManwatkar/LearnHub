"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To prevent UI flicker on load

  useEffect(() => {
    // Check sessionStorage for a token on initial load
    const storedToken = sessionStorage.getItem('token'); // Changed from localStorage
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);
        setCurrentUser(decodedUser);
        setToken(storedToken);
      } catch (error) {
        // Handle invalid token
        sessionStorage.removeItem('token'); // Changed from localStorage
      }
    }
    setIsLoading(false);
  }, []);

  const login = (jwtToken) => {
    try {
      const decodedUser = jwtDecode(jwtToken);
      sessionStorage.setItem('token', jwtToken); // Changed from localStorage
      setCurrentUser(decodedUser);
      setToken(jwtToken);
    } catch (error) {
      console.error("Failed to decode token on login", error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token'); // Changed from localStorage
    setCurrentUser(null);
    setToken(null);
  };

  const value = {
    currentUser,
    token,
    isLoading, // We can use this to show a loading spinner
    login,
    logout,
  };

  if (isLoading) {
    return null; // Or a loading spinner component
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};