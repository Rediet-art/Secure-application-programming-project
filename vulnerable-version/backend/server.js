const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

app.listen(3000, () => {
    console.log("🔥 VULNERABLE BACKEND running on http://localhost:3000");
});
