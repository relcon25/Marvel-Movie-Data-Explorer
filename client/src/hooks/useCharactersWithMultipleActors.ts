import { useEffect, useState } from "react";
import { fetchCharactersWithMultipleActors } from "../api/charactersWithMultipleActors";
import {Character} from "../types";

export const useCharactersWithMultipleActors = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCharactersWithMultipleActors()
            .then(setCharacters)
            .catch((error) => console.error("Error fetching characters with multiple actors:", error))
            .finally(() => setLoading(false));
    }, []);

    return { characters, loading };
};
