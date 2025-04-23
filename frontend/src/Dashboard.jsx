import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [membershipFees, setMembershipFees] = useState(0);
  const [sendingEmail, setSendingEmail] = useState(false);

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

  const sendDueDateReminders = () => {
    setSendingEmail(true);
    fetch('http://localhost:3000/email/send-due-date-reminders', {
      method: 'POST',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Log the preview URLs to the console
        console.log('Reminder emails sent:', data);
        if (data.emailPreviews) {
          console.log('Email previews:');
          data.emailPreviews.forEach(preview => {
            console.log(`Email to ${preview.user} (${preview.email}): ${preview.previewUrl}`);
          });
        }
        alert('Due date reminder emails sent successfully!');
      })
      .catch(error => {
        console.error('Error sending reminder emails:', error);
        alert('Failed to send reminder emails. Please try again.');
      })
      .finally(() => {
        setSendingEmail(false);
      });
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
      <button 
        className="reminder-button" 
        onClick={sendDueDateReminders}
        disabled={sendingEmail}
      >
        {sendingEmail ? 'Sending...' : 'Send due date reminder email'}
      </button>
    </div>
  );
}

export default Dashboard;