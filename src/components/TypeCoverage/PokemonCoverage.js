import React from "react";
import gen5Data from "../../data/gen5_pokemon.json";

const PokemonCoverage = ({ pokemonCounters }) => {
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
      <ul>
        {Object.entries(pokemonCounters).map(([pokemon, counters]) => {
          const matched = gen5Data.find(
            (p) => p.name.toLowerCase() === pokemon.toLowerCase()
          );

          return (
            <li key={pokemon} style={{ marginBottom: "12px" }}>
              {matched && matched.sprite && (
                <img
                  src={matched.sprite}
                  alt={pokemon}
                  style={{
                    width: "48px",
                    height: "48px",
                    marginRight: "6px",
                    verticalAlign: "middle",
                  }}
                />
              )}
              <strong>{pokemon}</strong>

              {counters && counters.length > 0 ? (
                <span style={{ marginLeft: "8px" }}>
                  ← countered by{" "}
                  {counters.map((counter) => {
                    const counterMatch = gen5Data.find(
                      (p) => p.name.toLowerCase() === counter.toLowerCase()
                    );
                    return counterMatch && counterMatch.icon ? (
                      <img
                        key={counter}
                        src={counterMatch.icon}
                        alt={counter}
                        title={counter}
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "4px",
                          verticalAlign: "middle",
                        }}
                      />
                    ) : (
                      <span key={counter}>{counter}</span>
                    );
                  })}
                </span>
              ) : (
                <span style={{ marginLeft: "8px" }}>(no counters)</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PokemonCoverage;
