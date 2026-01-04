const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/login', async(req, res) => {
    const {email, password} = req.body;

try {
        // 1. Query the database using the pool
        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows] = await db.execute(sql, [email]);

        // 2. Logic to check result
        if (rows.length > 0 && rows[0].password === password) {
            res.status(200).json({ 
                success: true, 
                user: {
                    email: rows[0].email,
                    role: rows[0].role
                }
             });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

app.post('/api/signup', async (req, res) => {
    const { email, firstName, lastName, phone, password } = req.body;

    try {
        const sql = "INSERT INTO users (username, email, phone, password, role) VALUES (?, ?, ?, ?, 'customer')";
        const [result] = await db.execute (sql, [`${firstName} ${lastName}`, email, phone, password]);

        res.status(201).json({
            success: true,
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Database error" });
    }
}); 

app.post('/api/check-user', async (req, res) => {
    const { email } = req.body;

    try {
        // Look for any user that has this email
        const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length > 0) {
            // MATCH FOUND: The email is in the database
            res.json({ exists: true, user: rows[0] }); 
        } else {
            // NO MATCH: The email is not in the database
            res.json({ exists: false });
        }
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));