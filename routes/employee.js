const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set your desired upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Use a unique name for the file
    }
});

const upload = multer({ storage });

// CREATE - Insert new user
router.post('/', upload.single('photo'), (req, res) => {
    console.log('Request Body:', req.body);
    
    const {
        country,
        account_type,
        username,
        lastname,
        firstname,
        email_address,
        contact_number,
    } = req.body;
    
    const photo = req.file ? req.file.path : null; // Get the uploaded file path
    
    const sql = 'INSERT INTO employees (country, account_type, username, lastname, firstname, email_address, contact_number, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [country, account_type, username, lastname, firstname, email_address, contact_number, photo], (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err);
            return res.status(500).json({ error: err.message });
        }

        const insertedData = {
            id: result.insertId,
            country,
            account_type,
            username,
            lastname,
            firstname,
            email_address,
            contact_number,
            photo
        };

        res.status(201).json(insertedData);
    });
});

// READ all users
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM employees';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// READ user by ID
router.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM employees WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
});

// UPDATE - Update user details with image upload
router.put('/:id', upload.single('photo'), (req, res) => {
    const {
        country,
        account_type,
        username,
        lastname,
        firstname,
        email_address,
        contact_number
    } = req.body;

    // If a new image is uploaded, prepend 'uploads/' to the filename; otherwise, keep the old one from the request body.
    const photo = req.file ? `uploads/${req.file.filename}` : req.body.photo;

    const sql = 'UPDATE employees SET country = ?, account_type = ?, username = ?, lastname = ?, firstname = ?, email_address = ?, contact_number = ?, photo = ? WHERE id = ?';

    db.query(sql, [country, account_type, username, lastname, firstname, email_address, contact_number, photo, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'User updated' });
    });
});


// DELETE user
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM employees WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'User deleted' });
    });
});

module.exports = router;
