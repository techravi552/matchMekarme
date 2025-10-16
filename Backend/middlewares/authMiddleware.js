// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No Token Provided." });
  }

// console.log(token)
// console.log(process.env.JWT_SECRET_KEY)

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
console.log(decoded)

    req.user = decoded; // { id,  }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

module.exports = authMiddleware;
