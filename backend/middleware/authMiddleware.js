const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Read token from cookies

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message); // Log error for debugging
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
