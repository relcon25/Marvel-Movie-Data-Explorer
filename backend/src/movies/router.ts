import express from "express";
import { moviesPerActor } from "./controller";
import { query } from "express-validator";

const router = express.Router();

/**
 * @route GET /moviesPerActor
 * @desc Get movies for a specific actor
 */
router.get(
  "/moviesPerActor",
  moviesPerActor,
);

export default router;
