import customResponses from "../utils/customResponse.js";
const isAdmin = (req, res, next) => {
  // Verifica si el usuario está autenticado y tiene el rol "Admin"
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json(
        customResponses.badResponse(
          403,
          "Acceso prohibido. Se requiere rol de administrador."
        )
      );
  }
};

export default isAdmin;
