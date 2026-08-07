import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      console.log("No token found in cookies.");
      return res.status(401).json({ message: "Not Authenticated!" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        console.log("Token verification failed:", err.message);
        return res.status(403).json({ message: "Token is not Valid!" });
      }

      req.userId = payload.id; // Attach user ID to request
      next();
    });
  } catch (error) {
    console.error("Error in verifyToken middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
