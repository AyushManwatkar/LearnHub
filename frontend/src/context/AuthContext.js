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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);
        setCurrentUser(decodedUser);
        setToken(storedToken);
      } catch (error) {
        // Handle invalid token
        sessionStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (jwtToken) => {
    try {
      const decodedUser = jwtDecode(jwtToken);
      sessionStorage.setItem('token', jwtToken);
      setCurrentUser(decodedUser);
      setToken(jwtToken);
    } catch (error) {
      console.error("Failed to decode token on login", error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setCurrentUser(null);
    setToken(null);
  };

  const value = {
    currentUser,
    token,
    isLoading,
    login,
    logout,
  };

  if (isLoading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};