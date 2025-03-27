import { useState, useEffect } from "react";
import BookList from "./BookList";
import "./Books.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  const [creatingBook, setCreatingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    // Filter books based on search term
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const fetchBooks = () => {
    fetch("http://localhost:3000/books")
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  };

  const handleEdit = (book) => {
    setEditingBook({...book});
  };

  const handleSaveEdit = () => {
    if (!editingBook.title.trim() || !editingBook.author.trim()) {
      alert("Title and Author cannot be empty");
      return;
    }

    const updateData = {
      id: editingBook.id,
      title: editingBook.title,
      author: editingBook.author,
      checked_out: editingBook.checked_out,
      borrower: editingBook.borrower,
      reservation: editingBook.reservation
    };

    fetch(`http://localhost:3000/books/${editingBook.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Failed to update book');
    })
    .then(data => {
      fetchBooks();
      setEditingBook(null);
    })
    .catch(error => {
      console.error('Error updating book:', error);
      alert('Failed to update book');
    });
  };

  const handleConfirmDelete = () => {
    if (!deletingBook) return;

    fetch(`http://localhost:3000/books/${deletingBook.id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        fetchBooks();
        setDeletingBook(null);
      } else {
        console.error('Failed to delete book');
      }
    })
    .catch(error => console.error('Error deleting book:', error));
  };

  const handleInitiateDelete = (book) => {
    setDeletingBook(book);
  };

  const handleCreateBook = () => {
    if (!creatingBook.title.trim() || !creatingBook.author.trim()) {
      alert("Title and Author cannot be empty");
      return;
    }

    const newBookData = {
      title: creatingBook.title,
      author: creatingBook.author,
      checked_out: creatingBook.checked_out || false,
      borrower: creatingBook.borrower || null,
      reservation: creatingBook.reservation || null
    };

    fetch("http://localhost:3000/books", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBookData)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Failed to create book');
    })
    .then(data => {
      fetchBooks();
      setCreatingBook(null);
    })
    .catch(error => {
      console.error('Error creating book:', error);
      alert('Failed to create book');
    });
  };

  const handleEditChange = (field, value, subField = null, isCreating = false) => {
    const updatedBook = isCreating 
      ? {...(creatingBook || {})} 
      : {...editingBook};
    
    if (subField) {
      // For nested fields like borrower and reservation
      updatedBook[field] = updatedBook[field] || {};
      updatedBook[field][subField] = value;
    } else {
      updatedBook[field] = value;
    }

    if (isCreating) {
      setCreatingBook(updatedBook);
    } else {
      setEditingBook(updatedBook);
    }
  };

  return (
    <div className="books-page">
      <div className="books-header">
        <h2>Books</h2>
        <button 
          className="create-book-btn" 
          onClick={() => setCreatingBook({
            title: '',
            author: '',
            checked_out: false
          })}
        >
          Create Book
        </button>
      </div>
      
      {/* Search Bar */}
      <input 
        type="text" 
        placeholder="Search books by title or author" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <BookList 
        books={filteredBooks} 
        onEdit={handleEdit} 
        onDelete={handleInitiateDelete} 
      />

      {/* Edit Modal */}
      {editingBook && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Edit Book</h3>
            
            <label>
              Title:
              <input 
                type="text" 
                value={editingBook.title} 
                onChange={(e) => handleEditChange('title', e.target.value)}
              />
            </label>

            <label>
              Author:
              <input 
                type="text" 
                value={editingBook.author} 
                onChange={(e) => handleEditChange('author', e.target.value)}
              />
            </label>

            <label>
              Checked Out:
              <input 
                type="checkbox" 
                checked={editingBook.checked_out}
                onChange={(e) => handleEditChange('checked_out', e.target.checked)}
              />
            </label>

            {editingBook.checked_out && (
              <div className="borrower-section">
                <label>
                  Borrower Name:
                  <input 
                    type="text" 
                    value={editingBook.borrower?.name || ''} 
                    onChange={(e) => handleEditChange('borrower', e.target.value, 'name')}
                  />
                </label>

                <label>
                  Due Date:
                  <input 
                    type="date" 
                    value={editingBook.borrower?.due_date || ''} 
                    onChange={(e) => handleEditChange('borrower', e.target.value, 'due_date')}
                  />
                </label>
              </div>
            )}

            {editingBook.reservation && (
              <div className="reservation-section">
                <label>
                  Reservation Start Date:
                  <input 
                    type="date" 
                    value={editingBook.reservation.start_date || ''} 
                    onChange={(e) => handleEditChange('reservation', e.target.value, 'start_date')}
                  />
                </label>

                <label>
                  Reservation End Date:
                  <input 
                    type="date" 
                    value={editingBook.reservation.end_date || ''} 
                    onChange={(e) => handleEditChange('reservation', e.target.value, 'end_date')}
                  />
                </label>
              </div>
            )}

            <div className="modal-actions">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setEditingBook(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Book Modal */}
      {creatingBook && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Create New Book</h3>
            
            <label>
              Title:
              <input 
                type="text" 
                value={creatingBook.title || ''} 
                onChange={(e) => handleEditChange('title', e.target.value, null, true)}
              />
            </label>

            <label>
              Author:
              <input 
                type="text" 
                value={creatingBook.author || ''} 
                onChange={(e) => handleEditChange('author', e.target.value, null, true)}
              />
            </label>

            <label>
              Checked Out:
              <input 
                type="checkbox" 
                checked={creatingBook.checked_out || false}
                onChange={(e) => handleEditChange('checked_out', e.target.checked, null, true)}
              />
            </label>

            {creatingBook.checked_out && (
              <div className="borrower-section">
                <label>
                  Borrower Name:
                  <input 
                    type="text" 
                    value={creatingBook.borrower?.name || ''} 
                    onChange={(e) => handleEditChange('borrower', e.target.value, 'name', true)}
                  />
                </label>

                <label>
                  Due Date:
                  <input 
                    type="date" 
                    value={creatingBook.borrower?.due_date || ''} 
                    onChange={(e) => handleEditChange('borrower', e.target.value, 'due_date', true)}
                  />
                </label>
              </div>
            )}

            <div className="modal-actions">
              <button onClick={handleCreateBook}>Create</button>
              <button onClick={() => setCreatingBook(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBook && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete the book "{deletingBook.title}" by {deletingBook.author}?</p>
            <div className="modal-actions">
              <button onClick={handleConfirmDelete}>Delete</button>
              <button onClick={() => setDeletingBook(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Books;