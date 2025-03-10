const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
const booksRouter = require("./routes/booksRoutes");
const usersRouter = require("./routes/usersRoutes");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/books", booksRouter);     // Sets api /books endpoint
app.use("/users", usersRouter);     // Sets api /users endpoint

// Test route to quickly see if server is running
app.get("/", (req, res) => {
    res.json("If you see this, its working");
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));