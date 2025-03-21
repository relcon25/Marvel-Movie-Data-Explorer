export interface Character {
  id: number;
  name: string;
  tmdb_id: number;
}
export interface TmdbCharacter {
  character: string;
  credit_id: string;
}

export interface MovieCharacterRelation {
  movie_id: number;
  character_id: number;
}
