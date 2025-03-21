import React from "react";
import { useActorsWithMultipleCharacters } from "../hooks/useActorsWithMultipleCharacters";

const ActorsWithMultipleCharactersPage = () => {
    const { actors, loading } = useActorsWithMultipleCharacters();

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Actors with Multiple Characters</h1>
            {Object.entries(actors).map(([actor, roles]) => (
                <div key={actor}>
                    <h2>{actor}</h2>
                    <ul>
                        {(Array.isArray(roles) ? roles : []).map(({ movieName, characterName }) => (
                            <li key={`${movieName}-${characterName}`}>
                                {characterName} in <strong>{movieName}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ActorsWithMultipleCharactersPage;
