import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="header">
        <h1>Welcome to Project Delta</h1>
        <p>A modern library management software </p>
      </header>

      <section className="features-section">
        <div className="feature-row">
          <div className="feature-text">
            <h2>Overview Dashboard</h2>
            <p>Users can easily see all necessary features from a glance</p>
          </div>
          <div className="feature-image">
            <img src="/feature1.png"/>
          </div>
        </div>

        <div className="feature-row reverse">
          <div className="feature-image">
            <img src="/feature2.png"/>
          </div>
          <div className="feature-text">
            <h2>Quick search</h2>
            <p>Quickly see if a book is available, reserved, or checked out</p>
          </div>
        </div>

        <div className="feature-row">
          <div className="feature-text">
            <h2>User-friendly admin tools</h2>
            <p>Easily adjust fees, book statuses, and user info</p>
          </div>
          <div className="feature-image">
            <img src="/feature3.png"/>
          </div>
        </div>

        <div className="feature-row reverse">
          <div className="feature-image">
            <img src="/feature4.jpg"/>
          </div>
          <div className="feature-text">
            <h2>Email Notifications</h2>
            <p>Get emailed notifications about reservations, due dates, and payments</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Get Started Now</h2>
          <p>Join thousands of satisfied customers today</p>
          <Link to="/login">
            <button className="signup-button">Sign Up Today</button>
          </Link>
          <div className="login-link">
            <p>Already have an account? <Link to="/login">Sign in instead</Link></p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;