const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/users", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).send("Access denied");
  }

  const [rows] = await db.execute("SELECT id,username,email,role FROM users");
  res.json(rows);
});

module.exports = router;
