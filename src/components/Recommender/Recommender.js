import React, { useEffect, useState } from "react";
import "./Recommender.css";
import { recommendAdditions } from "../analysis";

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

const Recommender = ({ pokemonTeam }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const res = recommendAdditions(pokemonTeam, 10);
    setData(res);
  }, [pokemonTeam]);

  if (!data) return (
    <div className="recommender-card">
      <h3>Recommended Additions</h3>
      <p>No data yet.</p>
    </div>
  );

  return (
    <div className="recommender-card">
      <h3>Recommended Additions</h3>
      <div className="rec-summary">
        Current: {data.baseCount}/{data.total}
      </div>
      <ul className="rec-list">
        {data.results.map((r) => (
          <li key={r.id} className="rec-item">
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
