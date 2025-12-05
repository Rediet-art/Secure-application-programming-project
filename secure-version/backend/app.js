require("dotenv").config();
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(helmet());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/admin", adminRoutes);

app.listen(3000, () => {
  console.log("Secure backend running on port 3000");
});
