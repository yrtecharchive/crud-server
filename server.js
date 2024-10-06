const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import path module
const db = require('./db'); // Make sure to import db

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parses JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded data

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const usersRouter = require('./routes/employee');
app.use('/api/employee', usersRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
