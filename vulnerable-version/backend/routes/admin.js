const express = require("express");
const router = express.Router();
const db = require("../db");

// NO admin check
router.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    res.json(results);
  });
});

module.exports = router;
