// booksController.js contains all controller functions necessary for CRUD for all books.
// - loadBooks: A helper function to load all books from the books.json file and returns an array of books.
// - getAllBooks: Fetches and returns all books from the database (books.json).
// - getBookById: Fetches a specific book by its ID from the database (books.json).
// - addBook: Adds a new book to the database (books.json) and returns the newly added book.
// - updateBook: Updates an existing book in the database (books.json) based on the provided ID and new data.
// - deleteBook: Deletes a book from the database (books.json) based on the provided ID.

const fs = require("fs");
const path = require("path");

// Path to books.json
const booksDatabase = path.join(__dirname, "../database/books.json");

// Function to load books
const loadBooks = () => {
    try {
        // Read the file and parse JSON data
        const rawData = fs.readFileSync(booksDatabase, 'utf-8');
        const booksData = JSON.parse(rawData);

        if (!booksData.books) {
            throw new Error("Books data is missing the 'books' key");
        }

        return booksData.books;
    } catch (error) {
        console.error("Error loading books data:", error);
        throw new Error("Unable to load books data");
    }
};

// Function to return all books
const getAllBooks = (req, res) => {
    try {
        res.json(loadBooks());
    } catch (error) {
        console.error("Error loading books:", error);
        res.status(404).json({ message: "There was an error loading the books." });
    }
};

// Function to return book by ID
const getBookById = (req, res) => {
    const books = loadBooks();
    const bookId = parseInt(req.params.id);
    
    // Search books array by book ID
    const book = books.find(book => book.id === bookId);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
};

// Function to add new book
const addBook = (req, res) => {
    const { title, author } = req.body;

    // Check for missing fields
    if (!title) return res.status(400).json({ message: "Missing TITLE field" });
    if (!author) return res.status(400).json({ message: "Missing AUTHOR field" });

    try {
        // Read the books data from books.json
        const data = fs.readFileSync(booksDatabase, "utf-8");
        const booksData = JSON.parse(data);

        // Ensure the books key exists in the data and is an array
        if (!Array.isArray(booksData.books)) {
            booksData.books = [];
        }

        // Create new book
        const newBook = {
            id: Date.now(),
            title,
            author,
            checked_out: false,
            borrower: null,
            reservation: null
        };

        booksData.books.push(newBook);

        // Write new book into books database
        fs.writeFileSync(booksDatabase, JSON.stringify(booksData, null, 2), "utf-8");
        console.log("Book added successfully:", newBook);
        res.status(201).json(newBook);
    } catch (error) {
        console.error("Error saving book:", error);
        res.status(500).json({ message: "There was an error adding the book." });
    }
};

// Function to update book
const updateBook = (req, res) => {
    const { id, title, author, checked_out, borrower, reservation } = req.body;

    // Load books data
    const books = loadBooks();

    // Find the index of the book to update
    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    const oldBook = books[bookIndex];

    // Create the updated book object
    const updatedBook = {
        ...oldBook,
        title: title ?? oldBook.title,
        author: author ?? oldBook.author,
        checked_out: checked_out ?? oldBook.checked_out,
        borrower: borrower === null ? null : (borrower ? { ...oldBook.borrower, ...borrower } : oldBook.borrower),
        reservation: reservation === null ? null : (reservation ? { ...oldBook.reservation, ...reservation } : oldBook.reservation)
    };

    books[bookIndex] = updatedBook; // Replace old book with updated one

    // Write the updated books array back to the books database
    try {
        fs.writeFileSync(booksDatabase, JSON.stringify({ books }, null, 2), "utf-8");
        res.status(200).json(updatedBook);
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "There was an error updating the book." });
    }
};


// Function to delete book
const deleteBook = (req, res) => {
    const books = loadBooks();
    const bookId = parseInt(req.params.id);

    // Find index of the book to delete
    const bookIndex = books.findIndex(book => book.id === bookId);

    // Check if the book exists
    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    const bookToDelete = books.splice(bookIndex, 1)[0]; // Delete book

    // Write the updated books array back books database
    try {
        const updatedBooksData = { books };
        fs.writeFileSync(booksDatabase, JSON.stringify(updatedBooksData, null, 2), 'utf-8');
        res.status(200).json({ message: "Book deleted", deletedBook: bookToDelete });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "There was an error deleting the book." });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook
};