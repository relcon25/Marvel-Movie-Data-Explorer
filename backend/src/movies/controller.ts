import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { validationResult, query } from "express-validator";
import moviesService from "./service";
import logger from "../shared/core/logger";

// Max movies allowed in a request (from environment variables)
const MAX_MOVIES = parseInt(process.env.MAX_MOVIES ?? "100");

/**
 * @route GET /moviesPerActor
 * @desc Fetch all movies for a given actor
 */
export const moviesPerActor = asyncHandler(
  async (req: Request, res: Response) => {
    await query("actor").isString().optional().run(req);
    await query("limit").isNumeric().optional().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const actorName = req.query.actor as string;
    const limit = (req.query.limit || MAX_MOVIES) as number;

    try {
      const moviesPerActor = await moviesService.moviesPerActor(
        limit,
        actorName,
      );
      res.json(moviesPerActor);
    } catch (e) {
      logger.error("Failed to fetch movies for actor", (e as Error).message);
      res.status(500).json({ error: "Failed to fetch movies for actor." });
    }
  },
);
