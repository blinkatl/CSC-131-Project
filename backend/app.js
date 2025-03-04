const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
const booksRouter = require("./routes/booksRoutes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Sets api /books endpoint
app.use("/books", booksRouter);

app.get("/", (req, res) => {
    res.json("If you see this, its working");
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));