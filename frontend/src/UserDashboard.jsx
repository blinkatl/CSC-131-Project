import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

function UserDashboard() {
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    activeLoans: [],
    reservations: [],
    wishlist: [],
    membershipDetails: {
      status: '',
      expirationDate: '',
      dueAmount: 0,
      fees: {
        overdueFines: 0,
        newUserFee: 0,
        membershipFee: 0
      }
    },
    recentActivity: [],
    notifications: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
        
        // Transform API data to match dashboard needs
        const transformedData = {
          name: data.name,
          username: data.username,
          activeLoans: data.active_books_checked_out.map(book => ({
            id: book.book_id,
            title: book.title,
            author: book.author,
            dueDate: book.due_date
          })) || [],
          // Fix: Use data.reservations instead of data.wish_list for reservations
          reservations: data.reservations ? data.reservations.map(book => ({
            id: book.book_id,
            title: book.title,
            author: book.author || "Unknown Author",
            availableDate: book.start_date || new Date().toISOString().split('T')[0]
          })) : [],
          wishlist: data.wish_list ? data.wish_list.filter(book => !book.available_date).map(book => ({
            id: book.book_id,
            title: book.title,
            author: book.author,
            dateAdded: book.date_added || new Date().toISOString().split('T')[0]
          })) : [],
          membershipDetails: {
            status: data.membership_dues.amount > 0 ? 'Due' : 'Active',
            expirationDate: data.membership_dues.due_date,
            dueAmount: data.membership_dues.amount + data.fees.overdue_fines + (data.fees.new_user_fee || 0),
            fees: {
              overdueFines: data.fees.overdue_fines || 0,
              newUserFee: data.fees.new_user_fee || 0,
              membershipFee: data.membership_dues.amount || 0
            }
          },
          recentActivity: data.borrowing_history.slice(0, 5).map((item, index) => ({
            id: index,
            type: item.return_date ? 'return' : 'loan',
            title: item.title,
            date: item.returned_date || item.borrowed_date
          })) || [],
          notifications: []
        };
        
        // Generate notifications based on data
        const notifications = [];
        
        // Add due date notifications
        data.active_books_checked_out.forEach((book, index) => {
          const dueDate = new Date(book.due_date);
          const today = new Date();
          const diffTime = dueDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 7 && diffDays > 0) {
            notifications.push({
              id: `due-${index}`,
              message: `Your book "${book.title}" is due in ${diffDays} days`,
              date: today.toISOString().split('T')[0]
            });
          } else if (diffDays <= 0) {
            notifications.push({
              id: `overdue-${index}`,
              message: `Your book "${book.title}" is overdue`,
              date: today.toISOString().split('T')[0]
            });
          }
        });
        
        // Add reservation notifications
        if (data.reservations && data.reservations.length > 0) {
          data.reservations.forEach((reservation, index) => {
            notifications.push({
              id: `reservation-${index}`,
              message: `Your reservation for "${reservation.title}" is available from ${new Date(reservation.start_date).toLocaleDateString()}`,
              date: new Date().toISOString().split('T')[0]
            });
          });
        }
        
        // Add membership due notification
        if (data.membership_dues.amount > 0) {
          const dueDate = new Date(data.membership_dues.due_date);
          const today = new Date();
          notifications.push({
            id: 'membership',
            message: `Your membership fee of $${data.membership_dues.amount.toFixed(2)} is due on ${new Date(data.membership_dues.due_date).toLocaleDateString()}`,
            date: today.toISOString().split('T')[0]
          });
        }
        
        transformedData.notifications = notifications;
        
        setUserData(transformedData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Function to search books
  const searchBooks = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:3000/books`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      const books = await response.json();
      
      // Filter books by query (case insensitive)
      const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) || 
        book.author.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filteredBooks.slice(0, 5)); // Limit to 5 results for the dropdown
    } catch (err) {
      console.error('Error searching books:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search to avoid excessive API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchBooks(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Function to get book status text and color
  const getBookStatus = (book) => {
    if (book.checked_out) {
      return { text: "Book Currently Out", color: "#ff4d4d" };
    } else if (book.reservation) {
      return { text: "Book Reserved", color: "#ffa64d" };
    } else {
      return { text: "Book Available", color: "#4dff88" };
    }
  };

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {userData.name}</h1>
        <p className="date-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>

      <div className="dashboard-grid">
        {/* Book Search Card - Taking up first column across both rows */}
        <div className="dashboard-card search-card" style={{ backgroundColor: '#222', borderTop: '4px solid #3498db' }}>
          <div className="card-header">
            <h2>Search Library</h2>
          </div>
          <div className="card-content search-content">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search for books..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {isSearching && <div className="search-loading">Searching...</div>}
              {searchResults.length > 0 && (
                <ul className="search-results">
                  {searchResults.map(book => {
                    const status = getBookStatus(book);
                    return (
                      <li key={book.id} className="search-result-item">
                        <div className="book-info">
                          <h3>{book.title}</h3>
                          <p>By {book.author}</p>
                        </div>
                        <div className="book-status" style={{ color: status.color }}>
                          {status.text}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              {searchQuery && searchResults.length === 0 && !isSearching && (
                <div className="no-results">No books found matching your search.</div>
              )}
            </div>
          </div>
        </div>

        {/* Currently Borrowed Books */}
        <div className="dashboard-card" style={{ backgroundColor: '#222', borderTop: '4px solid #9b59b6' }}>
          <div className="card-header">
            <h2>Currently Borrowed Books</h2>
            <Link to="/my-books" className="view-all">View All</Link>
          </div>
          <div className="card-content">
            {userData.activeLoans.length > 0 ? (
              <ul className="book-list">
                {userData.activeLoans.slice(0, 2).map(book => (
                  <li key={book.id} className="book-item">
                    <div className="book-info">
                      <h3>{book.title}</h3>
                      <p>By {book.author}</p>
                    </div>
                    <div className="book-due-date">
                      <p className={new Date(book.dueDate) < new Date() ? 'overdue' : ''}>
                        Due: {new Date(book.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">You don't have any books checked out.</p>
            )}
          </div>
          <div className="card-footer">
            <Link to="/search" className="action-button">Borrow Books</Link>
          </div>
        </div>

        {/* Membership & Fees Status */}
        <div className="dashboard-card" style={{ backgroundColor: '#222', borderTop: '4px solid #e74c3c' }}>
          <div className="card-header">
            <h2>Membership & Fees</h2>
          </div>
          <div className="card-content membership-content">
            <div className="membership-status">
              <div className={`status-badge ${userData.membershipDetails.status.toLowerCase()}`}>
                {userData.membershipDetails.status}
              </div>
              <p>Valid until: {new Date(userData.membershipDetails.expirationDate).toLocaleDateString()}</p>
            </div>
            
            <div className="fees-breakdown">
              <h3>Current Fees</h3>
              <ul className="fees-list">
                <li>
                  <span>Membership Fee:</span>
                  <span>${userData.membershipDetails.fees.membershipFee.toFixed(2)}</span>
                </li>
                <li>
                  <span>Overdue Fines:</span>
                  <span>${userData.membershipDetails.fees.overdueFines.toFixed(2)}</span>
                </li>
                <li>
                  <span>Other Fees:</span>
                  <span>${userData.membershipDetails.fees.newUserFee.toFixed(2)}</span>
                </li>
                <li className="fees-total">
                  <span>Total Due:</span>
                  <span>${userData.membershipDetails.dueAmount.toFixed(2)}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="card-footer">
            <Link to="/membership" className="action-button">Manage Membership</Link>
          </div>
        </div>

        {/* Wishlist */}
        <div className="dashboard-card" style={{ backgroundColor: '#222', borderTop: '4px solid #1abc9c' }}>
          <div className="card-header">
            <h2>Your Wishlist</h2>
            <Link to="/wishlist" className="view-all">View All</Link>
          </div>
          <div className="card-content">
            {userData.wishlist.length > 0 ? (
              <ul className="wishlist-list">
                {userData.wishlist.slice(0, 2).map(book => (
                  <li key={book.id} className="wishlist-item">
                    <div className="book-info">
                      <h3>{book.title}</h3>
                      <p>By {book.author}</p>
                    </div>
                    <div className="wishlist-date">
                      <p>Added: {new Date(book.dateAdded).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">Your wishlist is empty.</p>
            )}
          </div>
          <div className="card-footer">
            <Link to="/search" className="action-button">Add to Wishlist</Link>
          </div>
        </div>

        {/* Reservations */}
        <div className="dashboard-card" style={{ backgroundColor: '#222', borderTop: '4px solid #f39c12' }}>
          <div className="card-header">
            <h2>Your Reservations</h2>
            <Link to="/reservations" className="view-all">View All</Link>
          </div>
          <div className="card-content">
            {userData.reservations.length > 0 ? (
              <ul className="reservation-list">
                {userData.reservations.slice(0, 2).map(book => (
                  <li key={book.id} className="reservation-item">
                    <div className="book-info">
                      <h3>{book.title}</h3>
                      <p>By {book.author}</p>
                    </div>
                    <div className="reservation-status">
                      <p>Available: {new Date(book.availableDate).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No pending reservations.</p>
            )}
          </div>
          <div className="card-footer">
            <Link to="/search" className="action-button">Reserve Books</Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card" style={{ backgroundColor: '#222', borderTop: '4px solid #8e44ad' }}>
          <div className="card-header">
            <h2>Recent Activity</h2>
          </div>
          <div className="card-content">
            {userData.recentActivity.length > 0 ? (
              <ul className="activity-list">
                {userData.recentActivity.slice(0, 2).map(activity => (
                  <li key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'loan' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 10 4 15 9 20"></polyline>
                          <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                        </svg>
                      )}
                    </div>
                    <div className="activity-details">
                      <p>
                        <span className="activity-action">
                          {activity.type === 'loan' ? 'Borrowed' : 'Returned'}
                        </span> {activity.title}
                      </p>
                      <p className="activity-date">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No recent activity.</p>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="dashboard-card notification-card" style={{ backgroundColor: '#222', borderTop: '4px solid #2ecc71' }}>
          <div className="card-header">
            <h2>Notifications</h2>
            <Link to="/notifications" className="view-all">View All</Link>
          </div>
          <div className="card-content">
            {userData.notifications.length > 0 ? (
              <ul className="notification-list">
                {userData.notifications.slice(0, 2).map(notification => (
                  <li key={notification.id} className="notification-item">
                    <div className="notification-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                    </div>
                    <div className="notification-details">
                      <p>{notification.message}</p>
                      <p className="notification-date">{new Date(notification.date).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No new notifications.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;