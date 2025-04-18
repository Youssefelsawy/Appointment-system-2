const express = require("express");
const cors = require("cors");
const sequelize = require("./config/sequelize");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const corsOptions = {
  origin: [
    "https://onnmed-appointment-system.netlify.app", // Your frontend
    "http://localhost:3000", // For local testing
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // If using cookies/auth
};

const app = express();
//sequelize.sync({ alter: true });  // this for the first time only to sync the tables in the database based on the modles later we do migrations to track the changes in the models and update the database accordingly

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

// Routes
app.use("/api", authRoutes); // Use the auth routes under the /api path
app.use("/admin", adminRoutes);

// Default route
app.get("/", (req, res) => res.send("Appointment System API"));

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
