const express = require("express");
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json('If you see this, its working');
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));