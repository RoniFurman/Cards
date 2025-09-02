import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const tokenParts = token.split(".");
      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload._id;

      const response = await api.get(`/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/users/login", { email, password });

      if (typeof response.data === "string") {
        const token = response.data;
        localStorage.setItem("token", token);
        await fetchUserData();
        return { success: true };
      } else {
        throw new Error("Invalid token format received");
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/users", userData);
      const token = response.data;
      if (typeof token === "string") {
        localStorage.setItem("token", token);
        await fetchUserData();
        return { success: true };
      } else {
        throw new Error("Invalid token format received");
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateUser = async (userData) => {
    try {
      const response = await api.put("/users", userData);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Update failed",
      };
    }
  };

  const isAuthenticated = () => !!user;
  const isBusiness = () => user?.isBusiness || false;
  const isAdmin = () => user?.isAdmin || false;

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    isBusiness,
    isAdmin,
    fetchUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
