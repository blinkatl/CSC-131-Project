import { useState, useEffect } from "react";
import "./Users.css";

function UserList({ users, onEdit, onDelete }) {
  return (
    <div className="user-list">
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Administrator</th>
            <th>Active Books</th>
            <th>Membership Dues</th>
            <th>Fees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="user-row">
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.administrator ? 'Yes' : 'No'}</td>
              <td>{user.active_books_checked_out ? user.active_books_checked_out.length : 0}</td>
              <td>{user.membership_dues ? `$${user.membership_dues.amount} (Due: ${user.membership_dues.due_date})` : 'N/A'}</td>
              <td>{user.fees ? `$${user.fees.overdue_fines}` : 'N/A'}</td>
              <td className="user-actions">
                <button 
                  className="edit-btn" 
                  onClick={() => onEdit(user)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => onDelete(user)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [creatingUser, setCreatingUser] = useState(null);
  const [bookSearchTerm, setBookSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = () => {
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  const fetchBooks = () => {
    fetch("http://localhost:3000/books")
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  };

  const handleEdit = (user) => {
    // Ensure all optional fields have default values
    const preparedUser = {
      ...user,
      email: user.email || '',
      wish_list: user.wish_list || [],
      active_books_checked_out: user.active_books_checked_out || [],
      borrowing_history: user.borrowing_history || [],
      membership_dues: user.membership_dues || { amount: 0, due_date: new Date().toISOString().split('T')[0] },
      fees: user.fees || { overdue_fines: 0 }
    };
    setEditingUser(preparedUser);
  };

  const handleSaveEdit = () => {
    if (!editingUser.name.trim() || !editingUser.username.trim()) {
      alert("Name and Username cannot be empty");
      return;
    }

    const updateData = {
      id: editingUser.id,
      name: editingUser.name,
      username: editingUser.username,
      email: editingUser.email,
      administrator: Boolean(editingUser.administrator),
      active_books_checked_out: editingUser.active_books_checked_out,
      borrowing_history: editingUser.borrowing_history,
      wish_list: editingUser.wish_list,
      membership_dues: editingUser.membership_dues,
      fees: editingUser.fees,
      ...(editingUser.password && { password: editingUser.password })
    };

    fetch(`http://localhost:3000/users/${editingUser.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })
    .then(response => {
      if (response.ok) {
        fetchUsers();
        setEditingUser(null);
      } else {
        console.error('Failed to update user');
      }
    })
    .catch(error => console.error('Error updating user:', error));
  };

  const handleUpdateBookDueDate = (bookIndex, newDueDate) => {
    const updatedUser = {...editingUser};
    updatedUser.active_books_checked_out[bookIndex].due_date = newDueDate;
    setEditingUser(updatedUser);
  };

  const handleRemoveWishlistBook = (bookIndex) => {
    const updatedUser = {...editingUser};
    updatedUser.wish_list.splice(bookIndex, 1);
    setEditingUser(updatedUser);
  };

  const handleAddWishlistBook = (book) => {
    const updatedUser = {...editingUser};
    updatedUser.wish_list = updatedUser.wish_list || [];
    
    if (!updatedUser.wish_list.some(wb => wb.book_id === book.id)) {
      updatedUser.wish_list.push({
        book_id: book.id,
        title: book.title
      });
      setEditingUser(updatedUser);
    }
    setBookSearchTerm("");
  };

  const initNewUser = () => {
    setCreatingUser({
      name: '',
      username: '',
      email: '',
      password: '',
      administrator: false
    });
  };

  const handleCreateUser = () => {
    if (!creatingUser.name.trim() || !creatingUser.username.trim()) {
      alert("Name and Username cannot be empty");
      return;
    }

    const newUserData = {
      name: creatingUser.name,
      username: creatingUser.username,
      email: creatingUser.email,
      password: creatingUser.password,
      administrator: !!creatingUser.administrator,
      wish_list: [],
      active_books_checked_out: [],
      borrowing_history: [],
      membership_dues: {
        amount: 0,
        due_date: new Date().toISOString().split('T')[0]
      },
      fees: {
        overdue_fines: 0
      }
    };

    console.log("Creating user with data:", JSON.stringify(newUserData));

    fetch("http://localhost:3000/users", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUserData)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to create user');
      }
    })
    .then(data => {
      console.log("Server response:", data);
      fetchUsers();
      setCreatingUser(null);
    })
    .catch(error => console.error('Error creating user:', error));
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    console.log("Checkbox changed to:", isChecked);
    
    setCreatingUser(prev => {
      const updated = {
        ...prev,
        administrator: isChecked
      };
      console.log("Updated creating user state:", updated);
      return updated;
    });
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(bookSearchTerm.toLowerCase())
  );

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Users</h2>
        <button 
          className="create-user-btn" 
          onClick={initNewUser}
        >
          Create User
        </button>
      </div>
      
      {/* Search Bar */}
      <input 
        type="text" 
        placeholder="Search users by name, username, or email" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <UserList 
        users={filteredUsers} 
        onEdit={handleEdit} 
        onDelete={(user) => setDeletingUser(user)} 
      />

      {/* Edit Modal */}
      {editingUser && (
        <div className="edit-modal">
          <div className="edit-modal-content wide-modal">
            <h3>Edit User: {editingUser.name}</h3>
            
            <div className="user-edit-sections">
              <div className="user-details-section">
                <h4>User Details</h4>
                <label>
                  Name:
                  <input 
                    type="text" 
                    value={editingUser.name} 
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  />
                </label>

                <label>
                  Username:
                  <input 
                    type="text" 
                    value={editingUser.username} 
                    onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                  />
                </label>

                <label>
                  Email:
                  <input 
                    type="email" 
                    value={editingUser.email || ''} 
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  />
                </label>

                <label>
                  Password (optional):
                  <input 
                    type="password" 
                    placeholder="Leave blank to keep current password"
                    onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                  />
                </label>

                <label className="checkbox-label">
                  Administrator:
                  <input 
                    type="checkbox" 
                    className="admin-checkbox"
                    checked={editingUser.administrator === true}
                    onChange={(e) => setEditingUser({...editingUser, administrator: e.target.checked})}
                  />
                </label>

                <div className="membership-section">
                  <h4>Membership Details</h4>
                  <label>
                    Membership Dues:
                    <input 
                      type="number" 
                      value={editingUser.membership_dues.amount}
                      onChange={(e) => setEditingUser({
                        ...editingUser, 
                        membership_dues: {
                          ...editingUser.membership_dues, 
                          amount: parseFloat(e.target.value) || 0
                        }
                      })}
                    />
                  </label>
                  <label>
                    Dues Due Date:
                    <input 
                      type="date" 
                      value={editingUser.membership_dues.due_date}
                      onChange={(e) => setEditingUser({
                        ...editingUser, 
                        membership_dues: {
                          ...editingUser.membership_dues, 
                          due_date: e.target.value
                        }
                      })}
                    />
                  </label>

                  <label>
                    Overdue Fees:
                    <input 
                      type="number" 
                      value={editingUser.fees.overdue_fines}
                      onChange={(e) => setEditingUser({
                        ...editingUser, 
                        fees: {
                          ...editingUser.fees, 
                          overdue_fines: parseFloat(e.target.value) || 0
                        }
                      })}
                    />
                  </label>
                </div>
              </div>

              <div className="books-section">
                <div className="active-books-section">
                  <h4>Active Books Checked Out</h4>
                  {editingUser.active_books_checked_out && editingUser.active_books_checked_out.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Due Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editingUser.active_books_checked_out.map((book, index) => (
                          <tr key={book.book_id}>
                            <td>{book.title}</td>
                            <td>
                              <input 
                                type="date" 
                                value={book.due_date}
                                onChange={(e) => handleUpdateBookDueDate(index, e.target.value)}
                              />
                            </td>
                            <td>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No active books checked out</p>
                  )}
                </div>

                <div className="borrowing-history-section">
                  <h4>Borrowing History</h4>
                  {editingUser.borrowing_history && editingUser.borrowing_history.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Borrowed Date</th>
                          <th>Returned Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editingUser.borrowing_history.map((book) => (
                          <tr key={book.book_id}>
                            <td>{book.title}</td>
                            <td>{book.borrowed_date}</td>
                            <td>{book.returned_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No borrowing history</p>
                  )}
                </div>

                <div className="wishlist-section">
                  <h4>Wishlist</h4>
                  {editingUser.wish_list && editingUser.wish_list.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editingUser.wish_list.map((book, index) => (
                          <tr key={book.book_id}>
                            <td>{book.title}</td>
                            <td>
                              <button 
                                className="delete-btn"
                                onClick={() => handleRemoveWishlistBook(index)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No books in wishlist</p>
                  )}

                  <div className="add-to-wishlist">
                    <input 
                      type="text"
                      placeholder="Search books to add to wishlist"
                      value={bookSearchTerm}
                      onChange={(e) => setBookSearchTerm(e.target.value)}
                    />
                    {bookSearchTerm && (
                      <div className="book-search-results">
                        {filteredBooks.map((book) => (
                          <div 
                            key={book.id} 
                            className="book-search-item"
                            onClick={() => handleAddWishlistBook(book)}
                          >
                            {book.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {creatingUser && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Create New User</h3>
            
            <label>
              Name:
              <input 
                type="text" 
                value={creatingUser.name || ''} 
                onChange={(e) => setCreatingUser({...creatingUser, name: e.target.value})}
              />
            </label>

            <label>
              Username:
              <input 
                type="text" 
                value={creatingUser.username || ''} 
                onChange={(e) => setCreatingUser({...creatingUser, username: e.target.value})}
              />
            </label>

            <label>
              Email:
              <input 
                type="email" 
                value={creatingUser.email || ''} 
                onChange={(e) => setCreatingUser({...creatingUser, email: e.target.value})}
              />
            </label>

            <label>
              Password:
              <input 
                type="password" 
                value={creatingUser.password || ''} 
                onChange={(e) => setCreatingUser({...creatingUser, password: e.target.value})}
              />
            </label>

            <label className="checkbox-label">
              Administrator:
              <input 
                type="checkbox" 
                className="admin-checkbox"
                checked={Boolean(creatingUser.administrator)}
                onChange={handleCheckboxChange}
              />
            </label>

            <div className="modal-actions">
              <button onClick={handleCreateUser}>Create</button>
              <button onClick={() => setCreatingUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete the user "{deletingUser.name}" with username "{deletingUser.username}"?</p>
            <div className="modal-actions">
              <button onClick={() => {
                fetch(`http://localhost:3000/users/${deletingUser.id}`, {
                  method: 'DELETE',
                })
                .then(response => {
                  if (response.ok) {
                    fetchUsers();
                    setDeletingUser(null);
                  } else {
                    console.error('Failed to delete user');
                  }
                })
                .catch(error => console.error('Error deleting user:', error));
              }}>Delete</button>
              <button onClick={() => setDeletingUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;