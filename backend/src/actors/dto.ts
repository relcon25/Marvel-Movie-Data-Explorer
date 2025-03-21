export interface Actor {
  id: number;
  name: string;
  tmdb_id: number;
}

export interface MovieActorRelation {
  movie_id: number;
  actor_id: number;
}
