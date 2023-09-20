import { Router } from "express";
import { getAll, getOneById } from "../contollers/users.controller.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", getOneById);

export default router;
