import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AuthContext from '../context/auth/authContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user, logout } = authContext;

  const handleLogout = () => {
    logout();
    navigate('/signup');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
                // Show user info and logout when authenticated
                <>
                  <span className="navbar-text me-3">
                    Welcome, {user?.name}!
                  </span>
                  <button className="btn btn-outline-light" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                // Show login/signup when not authenticated
                <>
                  <Link to="/login" className="btn btn-outline-light me-2">
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

