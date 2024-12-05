  const express = require("express");
  const dotenv = require("dotenv");
  const cors = require("cors");
  const connectDB = require("./config/db");
  const authRoutes = require("./routes/authRoutes");

  dotenv.config();
  connectDB();

  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use("/api", authRoutes);

  app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
