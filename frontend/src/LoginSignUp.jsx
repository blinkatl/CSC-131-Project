import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginSignUp.css';

const LoginSignUp = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  
  const toggleSignIn = () => {
    setIsSignIn(true);
  };
  
  const toggleSignUp = () => {
    setIsSignIn(false);
  };
  
  return (
    <div className="container">
      <div className="left-panel">
        <div className="brand">Project Delta</div>
        <div className="tagline">The most popular library software</div>
        <Link to="/home" className="read-more-btn">Read More</Link>
        <svg className="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="1" d="M0,192L60,181.3C120,171,240,149,360,154.7C480,160,600,192,720,202.7C840,213,960,203,1080,186.7C1200,171,1320,149,1380,138.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
      <div className="right-panel">
        <div className="welcome-text">
          <h2>{isSignIn ? 'Hello Again!' : 'Create Account'}</h2>
          <p>{isSignIn ? 'Welcome Back' : 'Sign up to get started'}</p>
        </div>
        
        <div className="tab-toggle">
          <button 
            className={`tab-button ${isSignIn ? 'active' : ''}`} 
            onClick={toggleSignIn}
          >
            Sign In
          </button>
          <button 
            className={`tab-button ${!isSignIn ? 'active' : ''}`}
            onClick={toggleSignUp}
          >
            Sign Up
          </button>
        </div>
        
        <form className="auth-form">
          <div className="form-group">
            <input type="email" id="email" placeholder="Email Address" required />
          </div>
          <div className="form-group">
            <input type="password" id="password" placeholder="Password" required />
          </div>
          {!isSignIn && (
            <div className="form-group">
              <input type="password" id="confirm-password" placeholder="Confirm Password" required />
            </div>
          )}
          <button type="submit" className="login-btn">
            {isSignIn ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginSignUp;