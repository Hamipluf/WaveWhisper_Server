import authManager from "../utils/authManager.js";
import customResponses from "../utils/customResponse.js";

const authenticateMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Token no ingresado" });
  }

  const tokenParts = authHeader.split(" ");

  if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== "bearer") {
    return res.status(401).json({ error: "Formato de token no válido" });
  }

  const token = tokenParts[1];

  if (!token) {
    return res.status(401).json({ error: "Token no ingresado" });
  }

  const user = authManager.verifyToken(token);

  if (!user) {
    return res
      .status(401)
      .json(customResponses.badResponse(401, "Token inválido"));
  }

  req.user = user;
  next();
};

export default authenticateMiddleware;
