import axios from "axios";
import logger from "../shared/core/logger";
import {
  getCharacterByName,
  createCharacter,
  getCharactersWithMultipleActors as fetchCharactersWithMultipleActors, insertActorCharacterRelations,
} from "./repository";
import { MovieCharacterRelation, TmdbCharacter } from "./dto";
import { insertMovieCharacterRelations } from "../movies/repository";
import { Movie } from "../movies/dto";
import cache from "../shared/core/cache";
const TMDB_API_KEY = process.env.TMDB_API_KEY;
function normalizeCharacterName(name: string): string {
  return name
      .split("/")[0]             // keep only the first part before '/'
      .replace(/\(.*?\)/g, "")   // remove things like (uncredited), (voice)
      .replace(/ +/g, " ")       // normalize multiple spaces
      .trim();                   // remove leading/trailing whitespace
}
class CharactersService {
  /**
   * Fetch characters from movies and insert character-movie relationships.
   */
  async prefetchCharactersFromMovies(movies: Movie[], actorMap: Map<string, number>) {
    console.log('actorMap', {actorMap})
    const characterMoviePairs: MovieCharacterRelation[] = [];
    const actorCharacterPairs: { actor_id: number; character_id: number; movie_id: number }[] = [];

    for (const movie of movies) {
      try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.tmdb_id}/credits`,
            {
              headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
            }
        );

        const credits = response.data as {
          cast: Array<{ name: string; character: string; credit_id: string }>;
        };

        for (const castMember of credits.cast) {
          if (!castMember.character || !castMember.name) continue;

          const actor_id = actorMap.get(castMember.name);
          if (!actor_id) {
            // logger.warn(`Skipping ${castMember.name} (not in actor map)`);
            continue;
          }
          let normalizedName = normalizeCharacterName(castMember.character);
          console.log("Normalized character name:", normalizedName);

          let characterRecord = await getCharacterByName(normalizedName);

          if (!characterRecord) {
            try {
              characterRecord = await createCharacter({
                character: normalizedName,
                credit_id: castMember.credit_id,
              });
            } catch (error: any) {
              if (error.code === '23505') {
                // Race condition safety: fetch again
                characterRecord = await getCharacterByName(normalizedName);
                if (!characterRecord) throw error;
              } else {
                throw error;
              }
            }
          }

          characterMoviePairs.push({
            movie_id: movie.id,
            character_id: characterRecord.id,
          });

          actorCharacterPairs.push({
            movie_id: movie.id,
            actor_id,
            character_id: characterRecord.id,
          });
        }
      } catch (error) {
        logger.error(`❌ Error fetching characters for movie ${movie.title}`, error);
      }
    }

    await insertMovieCharacterRelations(characterMoviePairs);
    await insertActorCharacterRelations(actorCharacterPairs);

    logger.info(`✅ Inserted ${characterMoviePairs.length} movie-character and ${actorCharacterPairs.length} actor-character links.`);
  }

  /**
   * Fetch characters played by multiple actors.
   */
  async getCharactersWithMultipleActors(limit: number, character?: string) {
    const key = character
        ? `characters:multiple-actors:${character}:${limit}`
        : `characters:multiple-actors:all:${limit}`;

    try {
      const cached = await cache.get(key);
      if (cached) {
        logger.info(`🎭 Cache hit: ${key}`);
        return JSON.parse(cached);
      }

      logger.info(`🎭 Cache miss: ${key}, fetching from DB...`);
      const result = await fetchCharactersWithMultipleActors(limit, character);

      await cache.set(key, JSON.stringify(result), "EX", 60 * 60); // 1 hour TTL
      return result;
    } catch (error) {
      logger.error("❌ Failed to fetch characters with multiple actors", error);
      throw error;
    }
  }
}

export default new CharactersService();
