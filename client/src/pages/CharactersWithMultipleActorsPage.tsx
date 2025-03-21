import React from "react";
import { useCharactersWithMultipleActors } from "../hooks/useCharactersWithMultipleActors";

const CharactersWithMultipleActorsPage = () => {
    const { characters, loading } = useCharactersWithMultipleActors();

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Characters Played by Multiple Actors</h1>
            {Object.entries(characters).map(([character, actors]) => (
                <div key={character}>
                    <h2>{character}</h2>
                    <ul>
                        {Array.isArray(actors) ? (
                            actors.map(({ actorName, movieName }) => (
                                <li key={`${actorName}-${movieName}`}>
                                    Played by {actorName} in <strong>{movieName}</strong>
                                </li>
                            ))
                        ) : (
                            <p>No data available</p>
                        )}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default CharactersWithMultipleActorsPage;
