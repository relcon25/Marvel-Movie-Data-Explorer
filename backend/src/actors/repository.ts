import client from "../shared/core/db";
import logger from "../shared/core/logger";
import { Actor } from "./dto";

/**
 * Get an actor by name.
 */
export async function getActorByName(name: string): Promise<Actor | null> {
  const result = await client.query(
    `SELECT id, name, tmdb_id FROM actors WHERE name = $1;`,
    [name],
  );

  return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Insert a new actor.
 */
export async function createActor(actor: {
  name: string;
  tmdb_id: number;
}): Promise<Actor> {
  try {
    const result = await client.query(
      `INSERT INTO actors (name, tmdb_id)
         VALUES ($1, $2)
           ON CONFLICT (tmdb_id) 
       DO UPDATE SET name = EXCLUDED.name
                       RETURNING *;`, // ✅ Return all columns, avoiding another query
      [actor.name, actor.tmdb_id],
    );

    return result.rows[0];
  } catch (error) {
    logger.error("❌ Failed to insert actor", {
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Fetch all actors who have played multiple characters.
 */
export async function getActorsWithMultipleCharacters(
    limit: number,
    actor?: string,
): Promise<Record<string, { movieName: string; characterName: string }[]>> {
  const params: (string | number)[] = [];
  let filter = "";

  if (actor) {
    params.push(actor);
    filter = `WHERE a.name ILIKE $1`;
  }

  params.push(limit);

  const result = await client.query(`
    SELECT 
      a.name AS actor_name,
      json_agg(DISTINCT jsonb_build_object(
        'movieName', m.title,
        'characterName', c.name
      )) AS roles
    FROM actor_character ac
    JOIN actors a ON ac.actor_id = a.id
    JOIN characters c ON ac.character_id = c.id
    JOIN movies m ON ac.movie_id = m.id
    ${filter}
    GROUP BY a.name
    HAVING COUNT(DISTINCT c.id) > 1
    LIMIT $${params.length};
  `, params);

  const map: Record<string, { movieName: string; characterName: string }[]> = {};
  for (const row of result.rows) {
    map[row.actor_name] = row.roles;
  }

  return map;
}

