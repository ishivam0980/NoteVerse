import './App.css';
import { useState } from 'react';
import {
	  BrowserRouter as Router,
	  Routes,
	  Route,
	  Navigate
} from "react-router-dom";

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import NoteState from './context/notes/NoteState';
import AuthState from './context/auth/AuthState';
import Alert from './components/Alert';

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }

  return (
    <div className="App">
      <AuthState showAlert={showAlert}>
        <NoteState showAlert={showAlert}>
          <Router>
            <Navbar />
            <Alert alert={alert}/>
            <Routes>
              {/* Default route redirects to signup */}
              <Route exact path="/" element={<Navigate to="/signup" replace />} />
              
              {/* Protected route for home/notes */}
              <Route exact path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              
              {/* Public routes */}
              <Route exact path="/about" element={<About />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
            </Routes>
          </Router>
        </NoteState>
      </AuthState>
    </div>
  );
}

export default App;
