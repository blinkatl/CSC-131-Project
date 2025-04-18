import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Sidebar.css";
import logoImage from './assets/logo.png';

function Sidebar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isActualAdmin, setIsActualAdmin] = useState(false);
  const [viewMode, setViewMode] = useState("admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode the JWT to get user info (without verification)
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Store if user is actually an admin for the toggle functionality
        const adminStatus = payload.administrator === true;
        setIsActualAdmin(adminStatus);
        
        // Set initial view mode based on admin status
        const savedViewMode = localStorage.getItem("viewMode");
        if (adminStatus) {
          if (savedViewMode) {
            setViewMode(savedViewMode);
            setIsAdmin(savedViewMode === "admin");
          } else {
            setIsAdmin(true);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAdmin(false);
        setIsActualAdmin(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("viewMode");
    navigate("/login");
  };

  const toggleView = () => {
    const newViewMode = viewMode === "admin" ? "user" : "admin";
    setViewMode(newViewMode);
    setIsAdmin(newViewMode === "admin");
    localStorage.setItem("viewMode", newViewMode);
    
    // Redirect to appropriate dashboard based on view mode
    if (newViewMode === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <img src={logoImage} alt="Logo" className="sidebar-logo" />
          <span className="site-name">Project Delta</span>
        </Link>
      </div>
      
      <ul className="nav-links">
        {isAdmin ? (
          // Admin Navigation
          <>
            <li>
              <Link to="/admin/dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/users">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Users
              </Link>
            </li>
            <li>
              <Link to="/admin/books">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Books
              </Link>
            </li>
          </>
        ) : (
          // Regular User Navigation
          <>
            <li>
              <Link to="/dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/books">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                My Books
              </Link>
            </li>
            <li>
              <Link to="/reservations">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Reservations
              </Link>
            </li>
            <li>
              <Link to="/membership">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Membership
              </Link>
            </li>
            <li>
              <Link to="/notifications">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                Notifications
              </Link>
            </li>
          </>
        )}
      </ul>
      
      <div className="sidebar-footer">
        {isActualAdmin && (
          <button className="view-toggle-btn" onClick={toggleView}>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Switch to {viewMode === "admin" ? "User" : "Admin"} View
          </button>
        )}
        <button className="logout-link" onClick={handleLogout}>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;