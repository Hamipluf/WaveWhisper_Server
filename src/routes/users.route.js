import { Router } from "express";
import {
  getAll,
  getOneById,
  register,
  login,
} from "../contollers/users.controller.js";
import authenticateMiddleware from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/adminVerify.middleware.js";
const router = Router();
// Todos los users
router.get(
  "/",
  //  authenticateMiddleware,
  getAll
);
// Solamente authenticados y administradores tienen acceso a un solo user
router.get(
  "/:id",
  // authenticateMiddleware,
  //  isAdmin,
  getOneById
);
// Registrar user
router.post("/register", register);
// Logear user
router.post("/login", login);

export default router;
