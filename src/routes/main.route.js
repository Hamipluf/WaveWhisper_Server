import { Router } from "express";
import { main } from "../contollers/main.controller.js";

const router = Router();

router.get("/", main);

export default router 