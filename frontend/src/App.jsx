import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from './Home';
import About from './About';
import Credits from './Credits';
import Contact from './Contact';

function App() {

  return (
    <Router>
      <nav>
        <div class="navbar">
          <div class="left-navbar">
            <Link id="logo" to="/">LOGO/TITLE/ICON IDK</Link>
          </div>
          <div class="right-navbar">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/credits">Credits</Link>
            <Link to="/about">Contact</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App
