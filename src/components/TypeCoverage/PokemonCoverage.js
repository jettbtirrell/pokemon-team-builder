import React from "react";
import gen5Data from "../../data/gen5_pokemon.json";
import "./PokemonCoverage.css";

const PokemonCoverage = ({ pokemonCounters, supportMode }) => {
  if (!pokemonCounters) {
    return (
      <div className="pokemon-coverage">
        <h2>Pokémon Counters</h2>
        <p>No data yet.</p>
      </div>
    );
  }

  return (
    <div className="pokemon-coverage">
      <h2>Pokémon Counters</h2>
      <div className="pokemon-grid">
        {Object.entries(pokemonCounters).map(([pokemon, data]) => {
          const matched = gen5Data.find(p => p.name === pokemon.toLowerCase());
          const counters = data.counters || [];
          const weaknesses = data.weaknesses || [];

          const hasCounters = counters.length > 0;
          const displayCounters = counters.slice(0, 6);
          const displayWeaknesses = weaknesses.slice(0, 6);

          const problem = supportMode && weaknesses.length > 0 && counters.length === 0;

          return (
            <div
              key={pokemon}
              className={`pokemon-card ${
                problem ? "problem-card" : (!supportMode && !hasCounters ? "no-counters" : "")
              }`}
            >
              {matched && (
                <img src={matched.sprite} alt={pokemon} className="pokemon-main-sprite" />
              )}

              <div className="counter-slots">
                {Array.from({ length: 6 }).map((_, i) => {
                  const counter = displayCounters[i];
                  if (!counter) {
                    return <div key={i} className="counter-slot empty"></div>;
                  }
                  const counterMatch = gen5Data.find(
                    p => p.name === counter.toLowerCase()
                  );
                  return (
                    <div key={i} className="counter-slot filled">
                      {counterMatch ? (
                        <img
                          src={counterMatch.icon}
                          alt={counter}
                          title={counter}
                          className="counter-icon"
                        />
                      ) : (
                        <span>{counter}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {supportMode && (
                <div className="weakness-slots">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const weak = displayWeaknesses[i];
                    if (!weak) {
                      return <div key={i} className="weakness-slot empty"></div>;
                    }
                    const weakMatch = gen5Data.find(
                      p => p.name === weak.toLowerCase()
                    );
                    return (
                      <div key={i} className="weakness-slot filled">
                        {weakMatch ? (
                          <img
                            src={weakMatch.icon}
                            alt={weak}
                            title={weak}
                            className="weakness-icon"
                          />
                        ) : (
                          <span>{weak}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonCoverage;
