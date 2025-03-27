import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [membershipFees, setMembershipFees] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(users => {
        setUserCount(users.length);
        
        const totalFees = users.reduce((total, user) => {
          return total + (user.membership_dues?.amount || 0) + (user.fees?.overdue_fines || 0);
        }, 0);
        setMembershipFees(totalFees);
      })
      .catch(error => console.error('Error fetching users:', error));

    fetch('http://localhost:3000/books')
      .then(response => response.json())
      .then(books => {
        setBookCount(books.length);
      })
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  const handleUsersMoreInfo = () => {
    navigate('/admin/users');
  };

  const handleBooksMoreInfo = () => {
    navigate('/admin/books');
  };

  const handleFeesMoreInfo = () => {
    navigate('/admin/users');
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card users-card">
          <h2>Total Users</h2>
          <div className="card-content">
            <span className="card-number">{userCount}</span>
            <div 
              className="card-action" 
              onClick={handleUsersMoreInfo}
            >
              More Info →
            </div>
          </div>
        </div>

        <div className="dashboard-card books-card">
          <h2>Total Books</h2>
          <div className="card-content">
            <span className="card-number">{bookCount}</span>
            <div 
              className="card-action"
              onClick={handleBooksMoreInfo}
            >
              More Info →
            </div>
          </div>
        </div>

        <div className="dashboard-card fees-card">
          <h2>Total Fees Due</h2>
          <div className="card-content">
            <span className="card-number">${membershipFees.toFixed(2)}</span>
            <div 
              className="card-action"
              onClick={handleFeesMoreInfo}
            >
              More Info →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;