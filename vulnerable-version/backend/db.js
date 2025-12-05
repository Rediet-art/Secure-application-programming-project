
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "event_system",
  port:3306
});
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL (VULNERABLE)");
});

module.exports = db;