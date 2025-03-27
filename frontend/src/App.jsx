import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from './Home';
import About from './About';
import Credits from './Credits';
import Contact from './Contact';
import Sidebar from './Sidebar';
import Books from "./Books";
import Users from './Users';
import Dashboard from './Dashboard';

function App() {

  return (
    <Router>
      <div className='app-container'>
        <div className="navbar">
          <div className="left-navbar">
            <Link id="logo" to="/">LOGO/TITLE/ICON IDK</Link>
          </div>
          <div className="right-navbar">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/credits">Credits</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="main-content">
          <Sidebar />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/books" element={<Books />} />
              <Route path="/admin/users" element={<Users />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
