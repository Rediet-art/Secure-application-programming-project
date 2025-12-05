require("dotenv").config();
const express = require("express");
const session = require("express-session");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "secret123",
  resave: true,
  saveUninitialized: true
}));

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to the Vulnerable Event Management System Backend");
});

app.listen(3000, () => {
  console.log("Vulnerable backend running on port 3000");
});