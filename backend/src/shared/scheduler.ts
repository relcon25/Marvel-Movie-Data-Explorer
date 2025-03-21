import cron from "node-cron";
import moviesService from "../movies/service";
import actorsService from "../actors/service";
import charactersService from "../characters/service";
import logger from "./core/logger";
import cache from "./core/cache";
import { Movie } from "../movies/dto";

const LOCK_KEY = "prefetchMoviesAndActorsLock";
const LOCK_EXPIRATION_SECONDS = 17999; // 5 hours - 1 sec

/**
 * Runs the scheduled task to fetch movies and their actors, then populates `movie_actor` table.
 */
export async function runScheduledTask() {
  try {
    // Try to acquire a distributed lock to prevent duplicate executions
    const lockAcquired = await cache.set(
      LOCK_KEY,
      "locked",
      "EX",
      LOCK_EXPIRATION_SECONDS,
      "NX",
    );

    if (lockAcquired) {
      logger.info("✅ Lock acquired, running prefetchMoviesAndActors...");

      // Fetch movies from TMDB
      const movies = await moviesService.prefetchMoviesFromTmdb();
      if (movies) {
        const validMovies = movies.filter(
          (movie): movie is Movie => movie !== null,
        );

        if (validMovies.length > 0) {
          const { actorMap } =
            await actorsService.prefetchActorsFromMovies(movies);
          await charactersService.prefetchCharactersFromMovies(
            movies,
            actorMap,
          );

          logger.info("🎬 Movies & 🎭 Actors updated successfully!");
        }
      }
    } else {
      logger.info(
        "⏳ Another instance is running the scheduler. Skipping this cycle.",
      );
    }
  } catch (error) {
    cache.del(LOCK_KEY);

    logger.error("❌ Error in scheduled task:", error);
  }
}

// Schedule the job to run every 5 hours
cron.schedule("0 */5 * * *", () => {
  runScheduledTask();
});
