import express from "express";
import { getCharactersWithMultipleActors } from "./controller";

const router = express.Router();

/**
 * @route GET /charactersWithMultipleActors
 * @desc Get characters played by multiple actors
 */
router.get("/charactersWithMultipleActors", getCharactersWithMultipleActors);

export default router;
