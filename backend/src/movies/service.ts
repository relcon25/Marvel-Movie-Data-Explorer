import axios from "axios";
import logger from "../shared/core/logger";
import cache from "../shared/core/cache";
import pLimit from "p-limit";
import { Movie } from "./dto";
import {
  createMovie,
  moviesPerActor as fetchMoviesPerActor,
} from "./repository";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
import { ALLOWED_MOVIES } from "./constants";

const limit = pLimit(5);

class MoviesService {
  /**
   * Fetch movies from TMDB based on allowed TMDB IDs and store them in the DB.
   */
  async prefetchMoviesFromTmdb(): Promise<Movie[]> {
    const movieEntries = Object.entries(ALLOWED_MOVIES);
    const fetchedMovies: Movie[] = [];

    await Promise.all(
      movieEntries.map(([title, tmdb_id]) =>
        limit(async () => {
          try {
            interface TmdbMovieResponse {
              id: number;
              title: string;
              release_date: string;
            }

            const response = await axios.get<TmdbMovieResponse>(
              `https://api.themoviedb.org/3/movie/${tmdb_id}`,
              {
                headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
              },
            );

            const data = response.data;

            const movie: Movie = {
              id: data.id,
              tmdb_id: data.id,
              title: data.title,
              release_date: data.release_date,
            };

            const inserted = await createMovie(movie);
            if (inserted) {
              fetchedMovies.push(inserted);
            }
          } catch (error) {
            logger.error(`❌ Failed to fetch or insert movie: ${title}`, {
              error: (error as Error).message,
            });
          }
        }),
      ),
    );

    return fetchedMovies;
  }

  /**
   * Fetch all actors and their movies (for /moviesPerActor).
   */
  async moviesPerActor(
    limit: number,
    actor?: string,
  ): Promise<Record<string, string[]>> {
    const cacheKey = actor
      ? `moviesPerActor:${actor}:${limit}`
      : `moviesPerActor:all:${limit}`;

    try {
      const cached = await cache.get(cacheKey);
      if (cached) {
        logger.info("✅ Cache hit for moviesPerActor", { key: cacheKey });
        return JSON.parse(cached);
      }

      const result = await fetchMoviesPerActor(limit, actor);
      await cache.set(cacheKey, JSON.stringify(result), "EX", 60 * 10);
      return result;
    } catch (error) {
      logger.error("❌ Failed to fetch movies per actor", error);
      throw error;
    }
  }
}

export default new MoviesService();
