const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL EVENTS
router.get("/", (req, res) => {
    const sql = "SELECT * FROM events"; // no validation
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json(rows);
    });
});

// REGISTER FOR AN EVENT (SQL injection vulnerable)
router.post("/register", (req, res) => {
    const { user_id, event_id } = req.body;

    const sql = `INSERT INTO registrations (user_id, event_id) VALUES (${user_id}, ${event_id})`;

    db.query(sql, err => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Registered (insecurely)" });
    });
});

// STORED XSS - add a comment
router.post("/comment", (req, res) => {
    const { user_id, event_id, comment } = req.body;

    const sql = `INSERT INTO comments (user_id, event_id, comment) 
                 VALUES (${user_id}, ${event_id}, '${comment}')`;
    // VULNERABLE: stored XSS possible here

    db.query(sql, err => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Comment saved (insecure)" });
    });
});

// Retrieve comments (XSS fires here)
router.get("/comments/:event_id", (req, res) => {
    const sql = `SELECT * FROM comments WHERE event_id=${req.params.event_id}`;
    // no sanitization

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json(rows); // XSS delivered to frontend
    });
});

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../db");

// CREATE EVENT (NO SANITIZATION)
router.post("/create", (req, res) => {
  const { title, description, date, location } = req.body;

  const sql = `INSERT INTO events (title,description,date,location,organizer_id)
               VALUES ('${title}','${description}','${date}','${location}',1)`;

  db.query(sql, () => {
    res.send("Event created (INSECURE)");
  });
});

// VIEW EVENTS
router.get("/", (req, res) => {
  db.query("SELECT * FROM events", (err, results) => {
    res.json(results);
  });
});

module.exports = router;const express = require("express");
const router = express.Router();
const db = require("../db");

// VULNERABLE: GET ALL EVENTS
router.get("/", (req, res) => {
    const sql = "SELECT * FROM events";
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json(rows);
    });
});

// VULNERABLE: REGISTER FOR AN EVENT (SQLi allowed)
router.post("/register", (req, res) => {
    const { user_id, event_id } = req.body;

    const sql = `INSERT INTO registrations (user_id, event_id) 
                 VALUES (${user_id}, ${event_id})`;

    db.query(sql, err => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Registered (insecurely)" });
    });
});

// STORED XSS ENTRY POINT
router.post("/comment", (req, res) => {
    const { user_id, event_id, comment } = req.body;

    const sql = `INSERT INTO comments (user_id, event_id, comment)
                 VALUES (${user_id}, ${event_id}, '${comment}')`;

    db.query(sql, err => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Comment added (insecure)" });
    });
});

// STORED XSS DISPLAY
router.get("/comments/:event_id", (req, res) => {
    const sql = `SELECT * FROM comments WHERE event_id=${req.params.event_id}`;
    
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json(rows); // XSS payload delivered here
    });
});

module.exports = router;
