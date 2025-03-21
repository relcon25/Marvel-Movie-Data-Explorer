import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ActorsPage from "./pages/ActorsPage";
import MoviesPage from "./pages/MoviesPage";
import ActorsWithMultipleCharactersPage from "./pages/ActorsWithMultipleCharactersPage";
import CharactersWithMultipleActorsPage from "./pages/CharactersWithMultipleActorsPage";

const App = () => {
  return (
      <div>
        <nav>
          <ul>
            <li><Link to="/">Actors</Link></li>
            <li><Link to="/actors-multiple-characters">Actors with Multiple Characters</Link></li>
            <li><Link to="/characters-multiple-actors">Characters with Multiple Actors</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<ActorsPage />} />
          <Route path="/movies/:actor" element={<MoviesPage />} />
          <Route path="/actors-multiple-characters" element={<ActorsWithMultipleCharactersPage />} />
          <Route path="/characters-multiple-actors" element={<CharactersWithMultipleActorsPage />} />
        </Routes>
      </div>
  );
};

export default App;
