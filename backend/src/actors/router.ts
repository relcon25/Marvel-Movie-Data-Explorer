import express from "express";
import { getActorsWithMultipleCharacters, getActors } from "./controller";

const router = express.Router();

/**
 * @route GET /actorsWithMultipleCharacters
 * @desc Get actors who played multiple Marvel characters
 */
router.get("/actorsWithMultipleCharacters", getActorsWithMultipleCharacters);
router.get("/actors", getActors);

export default router;
