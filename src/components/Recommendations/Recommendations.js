import React, { useEffect, useState } from "react";
import "./Recommendations.css";
import gen5Pokemon from "../../data/gen5_pokemon.json";
import { coverageSummary } from "../analysis";

const Recommendations = ({ pokemonTeam }) => {
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    const currentSummary = coverageSummary(pokemonTeam);
    const currentCount = currentSummary.countByAtLeast[1] || 0;

    const newRecs = gen5Pokemon.map(p => {
      const newTeam = [...pokemonTeam, { name: p.name, moveTypes: p.types, pokemonTypes: p.types }];
      const summary = coverageSummary(newTeam);
      const newCount = summary.countByAtLeast[1] || 0;
      return {
        id: p.id,
        name: p.name,
        sprite: p.sprite,
        improvement: newCount - currentCount,
        ratio: `${newCount}/${gen5Pokemon.length}`
      };
    });

    newRecs.sort((a, b) => b.improvement - a.improvement);
    setRecs(newRecs.slice(0, 10));
  }, [pokemonTeam]);

  return (
    <div className="recommendations">
      <h3>Recommendations</h3>
      <ul>
        {recs.map(p => (
          <li key={p.id} className="recommendation-item">
            <img src={p.sprite} alt={p.name} style={{ width: "48px", height: "48px", imageRendering: "pixelated" }} />
            <span style={{ marginLeft: "8px" }}>{p.name}</span>
            <span style={{ marginLeft: "8px", color: p.improvement > 0 ? "green" : "gray" }}>
              {p.ratio} {p.improvement > 0 ? `(+${p.improvement})` : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
