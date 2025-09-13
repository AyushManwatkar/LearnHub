const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const hashed = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashed],
    function (err) {
      if (err) {
        console.error("Register error:", err);
        return res.status(400).json({ error: "Registration failed (email may be in use)" });
      }
      const user = { id: this.lastID, name, email };
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token, user });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
    if (err || !row) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: row.id, email: row.email }, JWT_SECRET);
    res.json({ token, user: { id: row.id, email: row.email, name: row.name } });
  });
});

module.exports = router;
