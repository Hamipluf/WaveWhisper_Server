import { Router } from "express";
import {
  getMyPlayList,
  getSongById,
  getTopTen,
  getSongByName
} from "../contollers/explore.controller.js";

const router = Router();

router.get("/my-play-list", getMyPlayList);
router.get("/top-ten", getTopTen);
router.get("/song-id/:tid", getSongById);
router.get("/song-name/:songName", getSongByName);

export default router;
