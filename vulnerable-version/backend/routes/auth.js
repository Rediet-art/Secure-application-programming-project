const express = require("express");
const router = express.Router();
const db = require("../db");

// VULNERABLE REGISTER
router.post("/register", (req, res) => {
  const { username, email, password, role } = req.body;

  const sql = `INSERT INTO users (username,email,password,role)
               VALUES ('${username}','${email}','${password}','${role}')`;

  db.query(sql, (err) => {
    if (err) throw err;
    res.send("User registered (INSECURE)");
  });
});

// VULNERABLE LOGIN (SQL Injection)
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

  db.query(sql, (err, results) => {
    if (results.length > 0) {
      req.session.user = results[0];
      res.send("Logged in (INSECURE)");
    } else {
      res.send("Login failed");
    }
  });
});

module.exports = router;
