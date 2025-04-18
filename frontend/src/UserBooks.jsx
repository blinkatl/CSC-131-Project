import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserBooks.css';

function UserBooks() {
  const [userData, setUserData] = useState({
    name: '',
    active_books_checked_out: [],
    borrowing_history: [],
    wish_list: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Decode the token to get user ID
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        // Fetch user data
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate days remaining until due date
  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return <div className="loading-container">Loading user book information...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="user-books-container">
      <h1 className="page-title">My Books</h1>

      {/* Currently Borrowed Books Section */}
      <div className="books-section">
        <h2 className="section-title">Currently Borrowed Books</h2>
        {userData.active_books_checked_out && userData.active_books_checked_out.length > 0 ? (
          <div className="card-container">
            {userData.active_books_checked_out.map(book => {
              const daysRemaining = calculateDaysRemaining(book.due_date);
              let statusClass = "status-normal";
              if (daysRemaining < 0) statusClass = "status-overdue";
              else if (daysRemaining < 3) statusClass = "status-warning";
              
              return (
                <div key={book.book_id} className="book-card">
                  <div className="book-header">
                    <h3 className="book-title">{book.title}</h3>
                  </div>
                  <div className="book-details">
                    <p><span className="detail-label">Author:</span> {book.author}</p>
                    <p>
                      <span className="detail-label">Due Date:</span> 
                      <span className={statusClass}>{formatDate(book.due_date)}</span>
                    </p>
                    <p className={statusClass}>
                      {daysRemaining < 0 
                        ? `Overdue by ${Math.abs(daysRemaining)} days` 
                        : `${daysRemaining} days remaining`}
                    </p>
                  </div>
                  <div className="book-actions">
                    <button className="btn btn-success">Renew</button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="empty-message">You don't have any books checked out currently.</p>
        )}
      </div>

      {/* Wishlist Section */}
      <div className="books-section">
        <h2 className="section-title">My Wishlist</h2>
        {userData.wish_list && userData.wish_list.length > 0 ? (
          <div className="card-container">
            {userData.wish_list.map(book => (
              <div key={book.book_id} className="book-card">
                <div className="book-header">
                  <h3 className="book-title">{book.title}</h3>
                </div>
                <div className="book-details">
                  <p><span className="detail-label">Author:</span> {book.author}</p>
                </div>
                <div className="book-actions">
                  <button className="btn btn-secondary">Reserve</button>
                  <button className="btn btn-outline">Remove</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">Your wishlist is empty.</p>
        )}
      </div>

      {/* Borrowing History Section */}
      <div className="books-section">
        <h2 className="section-title">Borrowing History</h2>
        {userData.borrowing_history && userData.borrowing_history.length > 0 ? (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Borrowed Date</th>
                  <th>Returned Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userData.borrowing_history.map(book => (
                  <tr key={`${book.book_id}-${book.borrowed_date}`}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{formatDate(book.borrowed_date)}</td>
                    <td>{formatDate(book.returned_date)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline">Borrow Again</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-message">You haven't borrowed any books yet.</p>
        )}
      </div>
    </div>
  );
}

export default UserBooks;