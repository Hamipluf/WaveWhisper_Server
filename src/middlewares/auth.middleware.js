import authManager from "../utils/authManager.js";
import customResponses from "../utils/customResponse.js";
const authenticateMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json(customResponses.badResponse(401, "Token no ingresado"));
  }

  const user = authManager.verifyToken(token);
  if (!user) {
    return res
      .status(401)
      .json(customResponses.badResponse(401, "Token invalido"));
  }

  // Puedes agregar el objeto user a la solicitud para que esté disponible en los controladores posteriores
  req.user = user;
  next();
};

export default authenticateMiddleware;
