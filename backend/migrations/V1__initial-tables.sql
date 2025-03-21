CREATE TABLE movies
(
    id           SERIAL PRIMARY KEY,
    tmdb_id      VARCHAR(255) UNIQUE NOT NULL,
    title        VARCHAR(255)        NOT NULL,
    release_date DATE                NOT NULL,
    created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE actors
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255)        NOT NULL UNIQUE,
    tmdb_id    VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE characters
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255)        NOT NULL UNIQUE,
    tmdb_id    VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE movie_actor
(
    movie_id   INT REFERENCES movies (id) ON DELETE CASCADE,
    actor_id   INT REFERENCES actors (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (movie_id, actor_id)
);

CREATE TABLE movie_character
(
    movie_id     INT REFERENCES movies (id) ON DELETE CASCADE,
    character_id INT REFERENCES characters (id) ON DELETE CASCADE,
    created_at   TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (movie_id, character_id)
);
CREATE TABLE actor_character
(
    actor_id     INT REFERENCES actors (id),
    character_id INT REFERENCES characters (id),
    movie_id     INT REFERENCES movies (id),
    PRIMARY KEY (actor_id, character_id, movie_id)
);


CREATE INDEX idx_movie_actor_actor_id ON movie_actor (actor_id);

CREATE INDEX idx_movie_actor_movie_id ON movie_actor (movie_id);

CREATE INDEX idx_movie_character_movie_id ON movie_character (movie_id);

CREATE INDEX idx_movie_character_character_id ON movie_character (character_id);

CREATE INDEX idx_movies_release_date ON movies (release_date);
