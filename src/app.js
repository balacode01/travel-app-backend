const express = require("express");
const cors = require("cors"); // Enable CORS
const helmet = require("helmet"); // Security headers
const routes = require("./routes");

const app = express();

// 🔹 Middleware
app.use(helmet()); // Security improvements
app.use(cors()); // Allow frontend requests
app.use(express.json()); // Use built-in JSON parser

// API Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

app.use("/api", routes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message); // Log error details
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
