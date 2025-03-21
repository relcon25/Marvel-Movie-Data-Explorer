import client from "../shared/core/db";
import logger from "../shared/core/logger";
import { Movie } from "./dto";
export async function moviesPerActor(limit: number, actor?: string): Promise<Record<string, string[]>> {
  try {
    let query: string;
    let params: any[];

    if (actor) {
      // ✅ Filter by actor
      query = `
        SELECT
          a.name AS actor_name,
          json_agg(DISTINCT m.title) AS movies
        FROM actors a
        JOIN movie_actor ma ON a.id = ma.actor_id
        JOIN movies m ON ma.movie_id = m.id
        WHERE a.name = $1
        GROUP BY a.name
        LIMIT $2;
      `;
      params = [actor, limit];
    } else {
      // ✅ Get all actors
      query = `
        SELECT
          a.name AS actor_name,
          json_agg(DISTINCT m.title) AS movies
        FROM actors a
        JOIN movie_actor ma ON a.id = ma.actor_id
        JOIN movies m ON ma.movie_id = m.id
        GROUP BY a.name
        LIMIT $1;
      `;
      params = [limit];
    }

    const result = await client.query(query, params);

    const actorMovieMap: Record<string, string[]> = {};
    result.rows.forEach(row => {
      actorMovieMap[row.actor_name] = row.movies;
    });

    return actorMovieMap;
  } catch (error) {
    logger.error("❌ Failed to fetch movies per actor", { error: (error as Error).message });
    throw error;
  }
}

/**
 * Insert a new movie into the database if not already present.
 */
export async function createMovie(movie: Movie): Promise<Movie | null> {
  try {
    const movieResult = await client.query(
        `INSERT INTO movies (tmdb_id, title, release_date)
       VALUES ($1, $2, $3) 
       ON CONFLICT (tmdb_id) DO UPDATE SET 
         title = EXCLUDED.title,
         release_date = EXCLUDED.release_date
       RETURNING id, tmdb_id, title, release_date;`,
        [movie.tmdb_id, movie.title, movie.release_date]
    );

    return movieResult.rows[0];
  } catch (error) {
    logger.error("❌ Failed to insert movie", { error: (error as Error).message });
    throw error;
  }
}

/**
 * Fetch all movies (used for bulk caching or setup).
 */
export async function getAllMovies(): Promise<Movie[]> {
  try {
    const result = await client.query(`
      SELECT id, tmdb_id, title, release_date
      FROM movies
      ORDER BY release_date DESC;
    `);
    return result.rows;
  } catch (error) {
    logger.error("❌ Failed to fetch all movies", { error: (error as Error).message });
    throw error;
  }
}

/**
 * Insert movie-character relations.
 */
export async function insertMovieCharacterRelations(
    movieCharacterPairs: { movie_id: number; character_id: number }[]
): Promise<void> {
  if (movieCharacterPairs.length === 0) return;

  const values = movieCharacterPairs
      .map(({ movie_id, character_id }) => `(${movie_id}, ${character_id})`)
      .join(",");

  try {
    await client.query(`
      INSERT INTO movie_character (movie_id, character_id)
      VALUES ${values}
      ON CONFLICT DO NOTHING;
    `);
    logger.info(`✅ Inserted ${movieCharacterPairs.length} movie-character relationships.`);
  } catch (error) {
    logger.error("❌ Failed to insert movie-character relations", error);
    throw error;
  }
}

/**
 * Insert movie-actor relations.
 */
export async function insertMovieActorRelations(
    movieActorPairs: { movie_id: number; actor_id: number }[]
): Promise<void> {
  if (movieActorPairs.length === 0) return;

  const values = movieActorPairs
      .map(({ movie_id, actor_id }) => `(${movie_id}, ${actor_id})`)
      .join(",");

  try {
    await client.query(`
      INSERT INTO movie_actor (movie_id, actor_id)
      VALUES ${values}
      ON CONFLICT DO NOTHING;
    `);
    logger.info(`✅ Inserted ${movieActorPairs.length} movie-actor relationships.`);
  } catch (error) {
    logger.error("❌ Failed to insert movie-actor relations", error);
    throw error;
  }
}
