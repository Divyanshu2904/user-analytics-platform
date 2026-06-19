const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");

// Load Environment variables
dotenv.config();

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static demo-site files and tracker script
app.use(express.static(path.join(__dirname, "public")));

// Routing API
app.use("/api", eventRoutes);

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy",
    message: "User Analytics Ingestion & Reporting Service is active." 
  });
});

// Port binding
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
