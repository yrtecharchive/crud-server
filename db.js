// db.js
const mysql = require('mysql');

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Default for XAMPP
    database: 'assessmentdb'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('MySQL connected...');
});

// Export the db connection
module.exports = db;
