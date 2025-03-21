import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import actorsService from "./service";
import logger from "../shared/core/logger";
import { query, validationResult } from "express-validator";

export const getActors = asyncHandler(async (req: Request, res: Response) => {
  const allActors = await actorsService.getActors();
  res.json(allActors);
});
/**
 * @route GET /actorsWithMultipleCharacters
 * @desc Get actors who played multiple Marvel characters
 */
export const getActorsWithMultipleCharacters = asyncHandler(
  async (req: Request, res: Response) => {
    await query("actor").isString().optional().run(req);
    await query("limit").isNumeric().optional().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const actor = req.query.actor as string;
    const limit = (req.query.limit || 100) as number;

    try {
      const actorsWithMultipleCharacters =
        await actorsService.getActorsWithMultipleCharacters(limit, actor);
      res.json(actorsWithMultipleCharacters);
    } catch (e) {
      logger.error(
        "❌ Failed to fetch actors with multiple characters",
        (e as Error).message,
      );
      res
        .status(500)
        .json({ error: "Failed to fetch actors with multiple characters." });
    }
  },
);
