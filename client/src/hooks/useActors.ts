import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/v1/api";

export const useActors = () => {
    const [actors, setActors] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActors = async () => {
            try {
                setLoading(true);
                const response = await axios.get<string[]>(`${API_URL}/actors`);
                setActors(response.data);
            } catch (err) {
                setError("Failed to fetch actors");
            } finally {
                setLoading(false);
            }
        };

        fetchActors();
    }, []);

    return { actors, loading, error };
};
