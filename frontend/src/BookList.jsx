import React from 'react';
import './BookList.css';

function BookList({ books, onEdit, onDelete }) {
  return (
    <div className="book-list">
      <table className="book-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="book-row">
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td className="book-actions">
                <button 
                  className="edit-btn" 
                  onClick={() => onEdit(book)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => onDelete(book)}
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

export default BookList;