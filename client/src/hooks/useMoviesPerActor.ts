import { useEffect, useState } from "react";
import { fetchMoviesPerActor } from "../api/moviesPerActor";

export const useMoviesPerActor = (actor: string) => {
    const [movies, setMovies] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!actor) return;
        fetchMoviesPerActor(actor)
            .then(setMovies)
            .catch((error) => console.error("Error fetching movies per actor:", error))
            .finally(() => setLoading(false));
    }, [actor]);

    return { movies, loading };
};
