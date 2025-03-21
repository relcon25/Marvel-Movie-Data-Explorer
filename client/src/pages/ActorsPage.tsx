import React from "react";
import { useActors } from "../hooks/useActors";
import { useNavigate } from "react-router-dom";

const ActorsPage = () => {
    const { actors, loading, error } = useActors();
    const navigate = useNavigate();

    if (loading) return <p>Loading actors...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Actors</h1>
            <ul>
                {actors.map((actor) => (
                    <li key={actor} onClick={() => navigate(`/movies/${actor}`)}>
                        {actor}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActorsPage;
