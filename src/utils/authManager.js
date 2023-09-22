import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_JWT;

class AuthManager {
  generateToken(user) {
    return jwt.sign(user, secretKey, { expiresIn: "1h" });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      return null;
    }
  }
}

const authManager = new AuthManager();
export default authManager;
