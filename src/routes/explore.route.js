import { Router } from "express";
import { getSong } from "../contollers/explore.controller.js";

const router = Router();

router.get("/", getSong);

export default router;
