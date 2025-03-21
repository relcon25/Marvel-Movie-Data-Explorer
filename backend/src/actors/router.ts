import express from "express";
import { getActorsWithMultipleCharacters } from "./controller";

const router = express.Router();

/**
 * @route GET /actorsWithMultipleCharacters
 * @desc Get actors who played multiple Marvel characters
 */
router.get("/actorsWithMultipleCharacters", getActorsWithMultipleCharacters);

export default router;
