import React, { useEffect, useState } from "react";
import "./Recommender.css";
import { recommendAdditions } from "../analysis";
import pokemon from "pokemon";

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

const normalizeName = (name) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const Recommender = ({ pokemonTeam, onAddPokemon, strictCounters }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const res = recommendAdditions(pokemonTeam, 10, strictCounters);
    setData(res);
  }, [pokemonTeam, strictCounters]);


  if (!data) return (
    <div className="recommender-card">
      <h3>Recommended Additions</h3>
      <p>No data yet.</p>
    </div>
  );

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
        Current: {data.baseCount}/{data.total}
      </div>
      <ul className="rec-list">
        {data.results.map((r) => (
          <li
            key={r.id}
            className="rec-item"
            onClick={() => handleClick(r.name)}
            style={{ cursor: "pointer" }}
          >
            <img src={r.sprite} alt={r.name} className="rec-sprite" />
            <div className="rec-meta">
              <div className="rec-name">{cap(r.name)}</div>
              <div className="rec-delta">
                {data.baseCount}/{data.total} → {r.newCount}/{data.total} (+{r.delta})
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
