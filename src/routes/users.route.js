import { Router } from "express";
import { getAll, getOneById } from "../contollers/users.controller.js";

const router = Router();

router.post("/register", getOneById);

router.get("/", getAll);
router.get("/:id", getOneById);

export default router;
