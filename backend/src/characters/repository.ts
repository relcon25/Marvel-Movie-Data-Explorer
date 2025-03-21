import client from "../shared/core/db";
import logger from "../shared/core/logger";
import { Character, TmdbCharacter } from "./dto";

/**
 * Get a character by name.
 */
export async function getCharacterByName(
  name: string,
): Promise<Character | null> {
  const result = await client.query(
    `SELECT id, name, tmdb_id FROM characters WHERE name = $1;`,
    [name],
  );

  return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Insert a new character.
 */
export async function createCharacter(
  character: TmdbCharacter,
): Promise<Character> {
  try {
    const result = await client.query(
      `INSERT INTO characters (name, tmdb_id) 
       VALUES ($1, $2) 
       ON CONFLICT (tmdb_id) 
       DO UPDATE SET name = EXCLUDED.name 
       RETURNING *;`,
      [character.character, character.credit_id],
    );

    return result.rows[0];
  } catch (error) {
    logger.error("❌ Failed to insert character", {
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Fetch characters played by multiple actors.
 */
export async function getCharactersWithMultipleActors(
    limit: number,
    character?: string
): Promise<Record<string, { movieName: string; actorName: string }[]>> {
  try {
    let query: string;
    let params: any[];

    if (character) {
      query = `
        SELECT
          c.name AS character_name,
          json_agg(DISTINCT jsonb_build_object('movieName', m.title, 'actorName', a.name)) AS appearances
        FROM actor_character ac
               JOIN characters c ON ac.character_id = c.id
               JOIN actors a ON ac.actor_id = a.id
               JOIN movies m ON ac.movie_id = m.id
        WHERE c.name = $1
        GROUP BY c.name
        HAVING COUNT(DISTINCT a.id) > 1
          LIMIT $2;
      `;
      params = [character, limit];
    } else {
      query = `
        SELECT
          c.name AS character_name,
          json_agg(DISTINCT jsonb_build_object('movieName', m.title, 'actorName', a.name)) AS appearances
        FROM actor_character ac
               JOIN characters c ON ac.character_id = c.id
               JOIN actors a ON ac.actor_id = a.id
               JOIN movies m ON ac.movie_id = m.id
        GROUP BY c.name
        HAVING COUNT(DISTINCT a.id) > 1
          LIMIT $1;
      `;
      params = [limit];
    }

    const result = await client.query(query, params);

    const map: Record<string, { movieName: string; actorName: string }[]> = {};
    for (const row of result.rows) {
      map[row.character_name] = row.appearances;
    }

    return map;
  } catch (error) {
    logger.error("❌ Failed to fetch characters with multiple actors", error);
    throw error;
  }
}

export async function insertActorCharacterRelations(
    triples: { actor_id: number; character_id: number; movie_id: number }[]
): Promise<void> {
  if (triples.length === 0) return;

  const values = triples
      .map(({ actor_id, character_id, movie_id }) => `(${actor_id}, ${character_id}, ${movie_id})`)
      .join(",");

  try {
    await client.query(`
      INSERT INTO actor_character (actor_id, character_id, movie_id)
      VALUES ${values}
      ON CONFLICT DO NOTHING;
    `);
    logger.info(`✅ Inserted ${triples.length} actor-character relations.`);
  } catch (error) {
    logger.error("❌ Failed to insert actor-character relations", error);
    throw error;
  }
}
