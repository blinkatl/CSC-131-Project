import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginSignUp.css';

const LoginSignUp = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  
  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users/');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, []);
  
  const toggleSignIn = () => {
    setIsSignIn(true);
    setError('');
  };
  
  const toggleSignUp = () => {
    setIsSignIn(false);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSignIn) {
      // Handle login (not implemented yet)
      console.log('Login attempted with:', { username, password });
      // Placeholder redirect
      navigate('#');
    } else {
      // Handle sign-up
      // Validate passwords match
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      // Check if username already exists
      const usernameExists = users.some(user => user.username === username);
      if (usernameExists) {
        setError('Username already exists, please choose another');
        return;
      }
      
      // Create new user
      const newUser = {
        name: `${firstName} ${lastName}`,
        username,
        password,
        administrator: false,
        active_books_checked_out: null,
        borrowing_history: null,
        wish_list: null,
        membership_dues: null,
        fees: null
      };
      
      try {
        const response = await fetch('http://localhost:3000/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });
        
        if (response.ok) {
          console.log('User created successfully!');
          // Placeholder redirect after successful sign-up
          navigate('#');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to create user');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        setError('An error occurred. Please try again.');
      }
    }
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
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isSignIn && (
            <>
              <div className="form-group">
                <input 
                  type="text" 
                  id="first-name" 
                  placeholder="First Name" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  id="last-name" 
                  placeholder="Last Name" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required 
                />
              </div>
            </>
          )}
          <div className="form-group">
            <input 
              type="text" 
              id="username" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              id="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          {!isSignIn && (
            <div className="form-group">
              <input 
                type="password" 
                id="confirm-password" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
          )}
          {error && <p style={{ color: 'red', marginBottom: '10px', fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit" className="login-btn">
            {isSignIn ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginSignUp;