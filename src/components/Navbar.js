import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AuthContext from '../context/auth/authContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user, logout } = authContext;

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/signup');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">NoteVerse</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
            aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {isAuthenticated() && (
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/home" ? "active" : ""}`} to="/home">My Notes</Link>
                </li>
              )}
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
              </li>
            </ul>
            
            <div className="d-flex align-items-center">
              {isAuthenticated() ? (
                // Show logout when authenticated
                <>
                  <button className="btn btn-light" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                // Show login/signup when not authenticated
                <>
                  <Link to="/login" className="btn btn-light me-2">
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-light">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

