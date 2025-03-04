// booksRoutes.js defines routes for managing books.
// API is accessed through http://localhost:3000/books/
//
// - GET /: Fetch all books
// - GET /:id: Fetch a single book by its ID
// - POST /: Add a new book to the system
// - PATCH /:id: Update the details of a book by its ID
// - DELETE /:id: Delete a book by its ID
//
// The controller functions are located in /controllers/booksController.js .

const {Router} = require("express");
const booksRouter = Router();
const booksController = require("../controllers/booksController");

// Route to get all books
booksRouter.get("/", booksController.getAllBooks);

// Route to get single book by ID
booksRouter.get("/:id", booksController.getBookById);

// Route to add new book
booksRouter.post("/", booksController.addBook);

// Route to update book
booksRouter.patch("/:id", booksController.updateBook);

// Route to delete book
booksRouter.delete("/:id", booksController.deleteBook);

module.exports = booksRouter;