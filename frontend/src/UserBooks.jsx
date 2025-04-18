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
  const [actionStatus, setActionStatus] = useState({ type: '', message: '', success: false });

  useEffect(() => {
    fetchUserData();
  }, []);

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

  // Extend due date by 14 days
  const extendDueDate = (dueDate) => {
    const date = new Date(dueDate);
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  };

  // Get earliest available date for reservation
  const getEarliestAvailableDate = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch book information');
      }

      const bookData = await response.json();
      
      // If book is not checked out, it's available tomorrow
      if (!bookData.checked_out) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
      }
      
      // If book is checked out, it's available the day after due date
      const dueDateObj = new Date(bookData.borrower.due_date);
      dueDateObj.setDate(dueDateObj.getDate() + 1);
      return dueDateObj.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error getting earliest available date:", error);
      return null;
    }
  };

  // Handle renew button click
  const handleRenew = async (bookId, dueDate) => {
    try {
      const token = localStorage.getItem('token');
      
      // First check if book has reservations
      const bookResponse = await fetch(`http://localhost:3000/books/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!bookResponse.ok) {
        throw new Error('Failed to fetch book details');
      }
      
      const bookData = await bookResponse.json();
      
      // If book has a reservation, don't allow renewal
      if (bookData.reservation) {
        setActionStatus({
          type: 'renew',
          message: 'Cannot renew: this book is reserved by another user.',
          success: false
        });
        return;
      }
      
      // If no reservation, extend due date by 14 days
      const newDueDate = extendDueDate(dueDate);

      // Update the book with new due date
      const updateResponse = await fetch(`http://localhost:3000/books/${bookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: parseInt(bookId),
          borrower: {
            due_date: newDueDate
          }
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to renew book');
      }

      // Update user data to reflect changes
      await fetchUserData();
      
      setActionStatus({
        type: 'renew',
        message: 'Book renewed successfully! New due date: ' + formatDate(newDueDate),
        success: true
      });
      
      // Clear status message after 5 seconds
      setTimeout(() => setActionStatus({ type: '', message: '', success: false }), 5000);
    } catch (error) {
      console.error("Error renewing book:", error);
      setActionStatus({
        type: 'renew',
        message: 'Error renewing book: ' + error.message,
        success: false
      });
    }
  };

  // Handle reserve button click (both wishlist and borrowing history)
  const handleReserve = async (bookId, source) => {
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      
      // Get user information for reservation
      const userResponse = await fetch(`http://localhost:3000/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user information');
      }
      
      const userData = await userResponse.json();
      
      // Get book information
      const bookResponse = await fetch(`http://localhost:3000/books/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!bookResponse.ok) {
        throw new Error('Failed to fetch book information');
      }
      
      const bookData = await bookResponse.json();
      
      // Calculate reservation dates
      const startDate = await getEarliestAvailableDate(bookId);
      
      // End date is 7 days after start date
      const endDateObj = new Date(startDate);
      endDateObj.setDate(endDateObj.getDate() + 7);
      const endDate = endDateObj.toISOString().split('T')[0];
      
      // Update book with reservation
      const updateBookResponse = await fetch(`http://localhost:3000/books/${bookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: parseInt(bookId),
          reservation: {
            start_date: startDate,
            end_date: endDate,
            name: userData.name,
            user_id: userId
          }
        })
      });
      
      if (!updateBookResponse.ok) {
        throw new Error('Failed to reserve book');
      }
      
      // Add reservation to user's reservations
      const userReservation = {
        book_id: bookId,
        title: bookData.title,
        author: bookData.author,
        start_date: startDate,
        end_date: endDate
      };
      
      const reservations = userData.reservations ? [...userData.reservations, userReservation] : [userReservation];
      
      const updateUserResponse = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: parseInt(userId),
          reservations: reservations
        })
      });
      
      if (!updateUserResponse.ok) {
        throw new Error('Failed to update user reservations');
      }
      
      // Update user data to reflect changes
      await fetchUserData();
      
      setActionStatus({
        type: source === 'wishlist' ? 'reserve-wishlist' : 'borrow-again',
        message: `Book reserved successfully! Available from ${formatDate(startDate)} to ${formatDate(endDate)}`,
        success: true
      });
      
      // Clear status message after 5 seconds
      setTimeout(() => setActionStatus({ type: '', message: '', success: false }), 5000);
    } catch (error) {
      console.error("Error reserving book:", error);
      setActionStatus({
        type: source === 'wishlist' ? 'reserve-wishlist' : 'borrow-again',
        message: 'Error reserving book: ' + error.message,
        success: false
      });
    }
  };

  // Handle removing a book from wishlist
  const handleRemoveFromWishlist = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      
      // Filter out the book from wishlist
      const updatedWishlist = userData.wish_list.filter(book => book.book_id !== bookId);
      
      // Update user with new wishlist
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: parseInt(userId),
          wish_list: updatedWishlist
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove book from wishlist');
      }
      
      // Update user data to reflect changes
      await fetchUserData();
      
      setActionStatus({
        type: 'remove-wishlist',
        message: 'Book removed from wishlist successfully!',
        success: true
      });
      
      // Clear status message after 5 seconds
      setTimeout(() => setActionStatus({ type: '', message: '', success: false }), 5000);
    } catch (error) {
      console.error("Error removing book from wishlist:", error);
      setActionStatus({
        type: 'remove-wishlist',
        message: 'Error removing book from wishlist: ' + error.message,
        success: false
      });
    }
  };

  // Check if book is already reserved by this user
  const isBookReservedByUser = (bookId) => {
    if (!userData.reservations) return false;
    return userData.reservations.some(reservation => reservation.book_id === bookId);
  };

  // Get reservation details for a book reserved by this user
  const getUserReservationForBook = (bookId) => {
    if (!userData.reservations) return null;
    return userData.reservations.find(reservation => reservation.book_id === bookId);
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

      {/* Status Messages */}
      {actionStatus.message && (
        <div className={`status-message ${actionStatus.success ? 'success' : 'error'}`}>
          {actionStatus.message}
        </div>
      )}

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
                    <button 
                      className="btn btn-success"
                      onClick={() => handleRenew(book.book_id, book.due_date)}
                    >
                      Renew
                    </button>
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
            {userData.wish_list.map(book => {
              const isReserved = isBookReservedByUser(book.book_id);
              const reservation = isReserved ? getUserReservationForBook(book.book_id) : null;

              return (
                <div key={book.book_id} className="book-card">
                  <div className="book-header">
                    <h3 className="book-title">{book.title}</h3>
                  </div>
                  <div className="book-details">
                    <p><span className="detail-label">Author:</span> {book.author}</p>
                    {isReserved && reservation && (
                      <p className="reservation-info">
                        <span className="detail-label">Reserved:</span>
                        <span className="status-normal">
                          Available from {formatDate(reservation.start_date)} to {formatDate(reservation.end_date)}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="book-actions">
                    {!isReserved ? (
                      <button 
                        className="btn btn-secondary"
                        onClick={() => handleReserve(book.book_id, 'wishlist')}
                      >
                        Reserve
                      </button>
                    ) : (
                      <p className="reservation-status">Reserved</p>
                    )}
                    <button 
                      className="btn btn-outline"
                      onClick={() => handleRemoveFromWishlist(book.book_id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
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
                {userData.borrowing_history.map(book => {
                  const isReserved = isBookReservedByUser(book.book_id);
                  const reservation = isReserved ? getUserReservationForBook(book.book_id) : null;

                  return (
                    <tr key={`${book.book_id}-${book.borrowed_date}`}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{formatDate(book.borrowed_date)}</td>
                      <td>{formatDate(book.returned_date)}</td>
                      <td>
                        {!isReserved ? (
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => handleReserve(book.book_id, 'history')}
                          >
                            Borrow Again
                          </button>
                        ) : (
                          <span className="reservation-status-sm">
                            Reserved ({formatDate(reservation.start_date)})
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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