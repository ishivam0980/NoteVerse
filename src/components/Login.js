import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';
import '../styles/Login.css';

export default function Login() {
  const authContext = useContext(AuthContext);
  const { login, isAuthenticated } = authContext;
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated() && isLoggingIn) {
      navigate('/home');
      setIsLoggingIn(false);
    }
  }, [isAuthenticated, navigate, isLoggingIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!credentials.email) newErrors.email = 'Email is required';
    if (!credentials.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoggingIn(true);
    const result = await login(credentials.email, credentials.password);
    
    if (!result.success) {
      setIsLoggingIn(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: '' });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h3>Welcome Back</h3>
          <p className="login-subtitle">Sign in to your account</p>
        </div>
        
        <div className="login-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input 
                type="email" 
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email" 
                value={credentials.email}
                onChange={onChange}
                placeholder="Enter your email address" 
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password" 
                value={credentials.password}
                onChange={onChange}
                placeholder="Enter your password" 
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            
            <button type="submit" className="login-btn" disabled={isLoggingIn}>
              {isLoggingIn ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="login-footer">
            <p>Don't have an account? 
              <Link to="/signup"> Create one here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}