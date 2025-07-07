import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';
import '../styles/Signup.css';

export default function Signup() {
  const authContext = useContext(AuthContext);
  const { register } = authContext;
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isRegistering, setIsRegistering] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (password.length === 0) return 0;
    if (password.length < 4) return 1;
    if (password.length < 6) return 2;
    if (password.length >= 6 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 4;
    if (password.length >= 6) return 3;
    return 2;
  };

  const passwordStrength = getPasswordStrength(credentials.password);

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.name) newErrors.name = 'Name is required';
    if (!credentials.email) newErrors.email = 'Email is required';
    if (!credentials.password) newErrors.password = 'Password is required';
    else if (credentials.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!credentials.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    else if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsRegistering(true);
    const result = await register(credentials.name, credentials.email, credentials.password);
    if (result.success) {
      navigate('/home');
    } else {
      setIsRegistering(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: '' });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h3>Join NoteVerse</h3>
          <p className="signup-subtitle">Create your account to get started</p>
        </div>
        
        <div className="signup-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input 
                type="text" 
                className={`form-control ${errors.name ? 'is-invalid' : credentials.name ? 'form-success' : ''}`}
                id="name" 
                value={credentials.name}
                onChange={onChange}
                placeholder="Enter your full name" 
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input 
                type="email" 
                className={`form-control ${errors.email ? 'is-invalid' : credentials.email ? 'form-success' : ''}`}
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
                placeholder="Choose a strong password" 
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              
              {/* Password strength indicator */}
              {credentials.password && (
                <div className="password-strength">
                  <div className={`strength-bar ${passwordStrength >= 1 ? 'weak' : ''}`}></div>
                  <div className={`strength-bar ${passwordStrength >= 2 ? 'weak' : ''}`}></div>
                  <div className={`strength-bar ${passwordStrength >= 3 ? 'medium' : ''}`}></div>
                  <div className={`strength-bar ${passwordStrength >= 4 ? 'strong' : ''}`}></div>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input 
                type="password" 
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : 
                  credentials.confirmPassword && credentials.password === credentials.confirmPassword ? 'form-success' : ''}`}
                id="confirmPassword" 
                value={credentials.confirmPassword}
                onChange={onChange}
                placeholder="Confirm your password" 
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
            
            <button type="submit" className="signup-btn" disabled={isRegistering}>
              {isRegistering ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="signup-footer">
            <p>Already have an account? 
              <Link to="/login"> Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}