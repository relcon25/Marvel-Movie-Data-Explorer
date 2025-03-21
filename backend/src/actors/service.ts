import axios from "axios";
import logger from "../shared/core/logger";
import {
  getActorByName,
  createActor,
  getActorsWithMultipleCharacters as fetchActorsWithMultipleCharacters,
} from "./repository";
import { ALLOWED_ACTORS } from "./constants"; // Predefined list of actors
import { Actor, MovieActorRelation } from "./dto";
import { insertMovieActorRelations } from "../movies/repository";
import { Movie } from "../movies/dto";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

class ActorsService {
  /**
   * Fetch actors from movies and insert actor-movie relationships.
   */
  async prefetchActorsFromMovies(movies: Movie[]): Promise<{
    actorMoviePairs: MovieActorRelation[];
    actorMap: Map<string, number>;
  }> {
    const actorMoviePairs: MovieActorRelation[] = [];
    const actorMap = new Map<string, number>();

    for (const movie of movies) {
      try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.tmdb_id}/credits`,
            {
              headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
            }
        );

        const credits = response.data as { cast: Array<Actor> };
        const actors = credits.cast.filter((actor) =>
            ALLOWED_ACTORS.includes(actor.name)
        );

        for (const actor of actors) {
          let actorRecord = await getActorByName(actor.name);

          if (!actorRecord) {
            actorRecord = await createActor({
              name: actor.name,
              tmdb_id: actor.id,
            });
          }

          actorMap.set(actor.name, actorRecord.id);

          actorMoviePairs.push({
            movie_id: movie.id,
            actor_id: actorRecord.id,
          });
        }
      } catch (error) {
        logger.error(`❌ Error fetching actors for movie ${movie.title}:`, error);
      }
    }

    await insertMovieActorRelations(actorMoviePairs);
    logger.info(`✅ Inserted ${actorMoviePairs.length} actor-movie relations.`);

    return { actorMoviePairs, actorMap };
  }

  /**
   * Fetch actors who played multiple characters.
   */
  async getActorsWithMultipleCharacters(limit:number, actor?: string) {
    try {
      return await fetchActorsWithMultipleCharacters(limit, actor);
    } catch (error) {
      logger.error("❌ Failed to fetch actors with multiple characters", error);
      throw error;
    }
  }
}

export default new ActorsService();
