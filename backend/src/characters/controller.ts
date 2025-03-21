import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import charactersService from "./service";
import logger from "../shared/core/logger";
import { query, validationResult } from "express-validator";

/**
 * @route GET /charactersWithMultipleActors
 * @desc Get characters played by multiple actors
 */
export const getCharactersWithMultipleActors = asyncHandler(
  async (req: Request, res: Response) => {
    await query("character").isString().optional().run(req);
    await query("limit").isNumeric().optional().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const character = req.query.character as string;
    const limit = (req.query.limit || 100) as number;

    try {
      const getCharactersWithMultipleActors =
        await charactersService.getCharactersWithMultipleActors(
          limit,
          character,
        );
      res.json(getCharactersWithMultipleActors);
    } catch (e) {
      logger.error(
        "❌ Failed to fetch characters with multiple actors",
        (e as Error).message,
      );
      res
        .status(500)
        .json({ error: "Failed to fetch characters with multiple actors." });
    }
  },
);
