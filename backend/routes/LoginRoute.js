const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';

// Example routes using the role-specific middleware
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        if (results.length > 0) {
            console.log(results);
            const Role = results[0].Role;
            const token = jwt.sign({ user: { username, Role } }, JWT_SECRET_KEY,{expiresIn: "1h"});
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });
            res.json({ message: 'Login successful', Role , data: results });
        } else {
            res.status(200).json({ message: 'Invalid credentials' });
        }
    });
});

module.exports = router;
