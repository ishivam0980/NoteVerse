import React, { useState, useEffect } from 'react';
import AuthContext from './authContext';
import axios from 'axios';
/*
AXIOS ERROR OBJECT STRUCTURE (sent by backend):
error = {
  message: "Request failed with status code 400",
  name: "AxiosError",
  code: "ERR_BAD_REQUEST",
  config: { url, method, headers, data... },
  request: XMLHttpRequest,
  response: {
    data: { 
      message: "Invalid email or password",           // ← Backend error message
      errors: [{ field: "email", message: "..." }]   // ← Validation errors (optional)
    },
    status: 400,                                      // ← HTTP status code
    statusText: "Bad Request",                        // ← HTTP status text
    headers: {...},
    config: {...}
  }
}

We use: error.response?.data?.message for user-friendly error messages
*/

const AuthState = (props) => {
  const host = "http://localhost:5000";
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Simple token management - just store/remove from localStorage
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  // Helper function to get headers with token
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${host}/api/auth/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token: authtoken } = response.data;
      setToken(authtoken);
      setAuthToken(authtoken);
      
      // Get user details after login
      await getUserWithToken(authtoken);
      
      props.showAlert("Login successful!", "success");
      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || "Login failed";
      props.showAlert(message, "danger");
      return { success: false, message };
    }
  };

  // Register user
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${host}/api/auth/register`, {
        name,
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token: authtoken, user: userData } = response.data;
      setToken(authtoken);
      setUser(userData);
      setAuthToken(authtoken);
      
      props.showAlert("Account created successfully!", "success");
      return { success: true };

    } catch (error) {
      console.error('Registration error:', error);
      const errors = error.response?.data?.errors || [];
      const msg = error.response?.data?.message || "Registration failed";
      const message = errors.length > 0
        ? `${msg}\n${errors.map(err => `${err.field}: ${err.message}`).join('\n')}`
        : msg;
      props.showAlert(message, "danger");
      return { success: false, message };
    }
  };

  // Get user details with a specific token
  const getUserWithToken = async (userToken) => {
    try {
      const response = await axios.get(`${host}/api/auth/user`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Get user error:', error);
      logout();
    }
  };

  // Get user details
  const getUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${host}/api/auth/user`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Get user error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    props.showAlert("Logged out successfully", "info");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Load user on app start
  useEffect(() => {
    if (token) {
      getUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated,
      getUser
    }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;