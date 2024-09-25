const jwt = require("jsonwebtoken");
const User = require("../models/auth-model");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  console.log("Authorization Header:", token); // Log the token for debugging

  // Check if the token is provided and in the correct format "Bearer <jwtToken>"
  if (!token || !token.startsWith("Bearer ")) {
    console.log("Token not provided or invalid format");
    return res.status(401).json({ message: "Unauthorized HTTP, Invalid or missing token" });
  }

  // Extract the actual JWT token by removing the "Bearer " prefix
  const jwtToken = token.split(" ")[1];
  console.log("Extracted JWT Token:", jwtToken); // Log the extracted token

  try {
    // Verify the token using the secret key
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    console.log("Token verification result:", isVerified); // Log the verification result

    // Find the user in the database by email
    const userData = await User.findOne({ email: isVerified.email }).select({
      password: 0,  // Exclude password
      // isAdmin: 1,   // Include isAdmin for further logic
    });
    console.log("User Data:", userData); // Log user data

    // Check if user exists
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the token and user data to the request object for future middleware or routes
    req.token = jwtToken;
    req.user = userData;
    req.userID = userData._id;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification error:", error.message); // Log any errors during verification

    // Handle specific token expiration error
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }

    // Generic token error handling
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

module.exports = authMiddleware;
