import { useState, useEffect } from "react";
import { fetchActorsWithMultipleCharacters } from "../api/actorsWithMultipleCharacters";
import {Actor} from "../types";

export function useActorsWithMultipleCharacters() {
    const [actors, setActors] = useState<Record<string, { movieName: string; characterName: string }[]> >({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadActors = async () => {
            try {
                const response = await fetchActorsWithMultipleCharacters();
                setActors(response);
            } catch (err) {
                setError("Failed to fetch actors.");
            } finally {
                setLoading(false);
            }
        };

        loadActors();
    }, []);

    return { actors, loading, error }; // ✅ Make sure 'error' is returned
}
