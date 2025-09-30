import React, { useEffect, useState } from "react";
import "./Recommender.css";
import pokemon from "pokemon";
import { recommendAdditions, recommendSupportAdditions } from "../analysis";

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const normalizeName = (name) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const Recommender = ({ pokemonTeam, onAddPokemon, strictCounters, supportMode }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (supportMode) {
      setData(recommendSupportAdditions(pokemonTeam, 35, strictCounters));
    } else {
      setData(recommendAdditions(pokemonTeam, 35, strictCounters));
    }
  }, [pokemonTeam, supportMode, strictCounters]);

  if (!data) {
    return (
      <div className="recommender-card">
        <h3>Recommended Additions</h3>
        <p>No data yet.</p>
      </div>
    );
  }

  const handleClick = (name) => {
    try {
      const normName = normalizeName(name);
      const id = pokemon.getId(normName);
      if (!id) return;
      if (onAddPokemon) onAddPokemon(normName);
    } catch (e) {
      console.warn(`Could not add Pokémon: ${name}`, e);
    }
  };

  return (
    <div className="recommender-card">
      <h3>Recommended Additions</h3>
      <div className="rec-summary">
        {supportMode ? (
          <>Current exploitable enemies: {data.problemCount}</>
        ) : (
          <>Current: {data.baseCount}/{data.total}</>
        )}
      </div>
      <ul className="rec-grid">
        {data.results.map((r) => (
          <li
            key={r.id}
            className="rec-item"
            onClick={() => handleClick(r.name)}
          >
            <img src={r.sprite} alt={r.name} className="rec-sprite" />
            <div className="rec-meta">
              <div className="rec-name">{cap(r.name)}</div>
              <div className="rec-delta">
                {supportMode ? (
                  <>Fixes {r.fixes} ({Math.round((r.fixes / data.problemCount) * 100)}%)</>
                ) : (
                  <>{data.baseCount}/{data.total} → {r.newCount}/{data.total} (+{r.delta})</>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {data.results.length === 0 && <p>No single addition improves coverage.</p>}
    </div>
  );
};

export default Recommender;
