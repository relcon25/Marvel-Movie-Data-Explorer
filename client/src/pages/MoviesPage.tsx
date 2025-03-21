import React from "react";
import { useParams } from "react-router-dom";
import { useMoviesPerActor } from "../hooks/useMoviesPerActor";

const MoviesPage = () => {
    const { actor } = useParams<{ actor: string }>();
    const { movies={}, loading } = useMoviesPerActor(actor || "");

    if (loading) return <p>Loading movies...</p>;
    return (
        <div>
            <h1>Movies featuring {actor}</h1>
            <ul>
                {Object.entries(movies).map(([actor, movieList]) => (
                    <li key={actor}>
                        <strong>{actor}</strong>: {movieList.join(", ")}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MoviesPage;
