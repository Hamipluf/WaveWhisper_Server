import { Router } from "express";
import {
  getAll,
  getOneById,
  register,
  login,
  authUser,
  callbackSpotify,
} from "../contollers/users.controller.js";
import authenticateMiddleware from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/adminVerify.middleware.js";
import passport from "passport";
const router = Router();
// user autenticado
router.get("/", authenticateMiddleware, authUser);
// Todos los users
router.get("/get-all", authenticateMiddleware, getAll);
// Solamente authenticados y administradores tienen acceso a un solo user
router.get("/:id", authenticateMiddleware, isAdmin, getOneById);
// Ruta de retorno de Spotify después de autorización
router.get(
  "/spotify/callback",
  passport.authenticate("spotify", {
    failureRedirect: "/",
    passReqToCallback: true,
    session: false,
  }),
  callbackSpotify
);
// Registrar user
router.post("/register", register);
// Logear user
router.post("/login", login);
// Ruta de inicio de sesión de Spotify
router.get("/auth/spotify", passport.authenticate("spotify"));
export default router;
