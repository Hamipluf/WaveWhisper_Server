import authManager from "../utils/authManager.js";
import customResponses from "../utils/customResponse.js";
export const authMiddleware = (req, res, next) => {
  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies.jwt; // 'jwt' es el nombre de la cookie
  }
  if (!token) {
    return res
      .status(401)
      .json(customResponses.badResponse(401, "Token no ingresado o inválido"));
  }
  const user = authManager.verifyToken(token);
  if (!user) {
    return res
      .status(401)
      .json(customResponses.badResponse(401, "Token inválido o expirado"));
  }
  req.user = user;
  next();
};
