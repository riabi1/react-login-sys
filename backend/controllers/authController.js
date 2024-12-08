const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");

const passwordPolicy =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

// Register method
exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!passwordPolicy.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login method
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const lockTimeLeft = Math.ceil((user.lockUntil - Date.now()) / 1000);
      return res.status(403).json({
        message: `Account is temporarily locked. Please try again after ${lockTimeLeft} seconds.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = Date.now() + 60 * 1000; // Lock for 1 minute
      }
      await user.save();
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true only in production
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
exports.validateAuth = (req, res) => {
  res.status(200).json({ message: "User is authenticated", user: req.user });
};
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful" });
};
