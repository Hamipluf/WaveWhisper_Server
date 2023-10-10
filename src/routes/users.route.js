import { Router } from "express";
import {
  getAll,
  getOneById,
  register,
  login,
  authUser,
  callbackSpotify,
} from "../contollers/users.controller.js";
import isAdmin from "../middlewares/adminVerify.middleware.js";
import passport from "passport";
const router = Router();
// user autenticado
router.get(
  "/",
  passport.authenticate("jwtCookies", {
    session: false,
    passReqToCallback: true,
  }),
  authUser
);
// Todos los users
router.get("/get-all", getAll);
// Solamente authenticados y administradores tienen acceso a un solo user
router.get("/:id", isAdmin, getOneById);
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
router.post(
  "/register",
  passport.authenticate("Register", {
    passReqToCallback: true,
    session: false,
  }),
  register
);
// Logear user
router.post(
  "/login",
  passport.authenticate("Login", {
    passReqToCallback: true,
    session: false,
  }),
  login
);
// Ruta de inicio de sesión de Spotify
router.get("/auth/spotify", passport.authenticate("spotify"));
export default router;
