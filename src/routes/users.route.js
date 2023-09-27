import { Router } from "express";
import {
  getAll,
  getOneById,
  register,
  login,
  authUser,
} from "../contollers/users.controller.js";
import authenticateMiddleware from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/adminVerify.middleware.js";
const router = Router();
// user autenticado
router.get("/", authenticateMiddleware, authUser);
// Todos los users
router.get("/get-all", authenticateMiddleware, getAll);
// Solamente authenticados y administradores tienen acceso a un solo user
router.get("/:id", authenticateMiddleware, isAdmin, getOneById);
// Registrar user
router.post("/register", register);
// Logear user
router.post("/login", login);
export default router;
