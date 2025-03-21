export interface Movie {
  id: number;
  tmdb_id: number;
  title: string;
  release_date: string;
}

export interface TmdbMovie {
  tmdb_id: string;
  title: string;
  release_date: string;
}

export interface CreateMovie {
  tmdb_id: number;
  title: string;
  release_date: string;
}

export interface MoviesByActor {
  actorName: string;
  movies: string[];
}
