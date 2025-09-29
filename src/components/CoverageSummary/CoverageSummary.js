import React, { useEffect, useState } from "react";
import { analyzePokemonCounters, isCounter, effectiveness } from "../analysis";
import gen5Pokemon from "../../data/gen5_pokemon.json";

const CoverageSummary = ({ pokemonTeam, strictCounters, supportMode }) => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (pokemonTeam && pokemonTeam.length > 0) {
      if (supportMode) {
        let exploitable = 0;
        gen5Pokemon.forEach((enemy) => {
          const hasWeakTarget = pokemonTeam.some((ally) =>
            enemy.types.some(
              (stab) => effectiveness(stab, ally.pokemonTypes) > 1
            )
          );
          const hasCounter = pokemonTeam.some((ally) =>
            isCounter(ally, enemy, strictCounters)
          );
          if (hasWeakTarget && !hasCounter) {
            exploitable++;
          }
        });
        setSummary({ total: gen5Pokemon.length, exploitable });
      } else {
        const counters = analyzePokemonCounters(pokemonTeam, strictCounters);
        const total = Object.keys(counters).length;
        let totalCountered = 0;
        let counteredBy2 = 0;
        let counteredBy3 = 0;
        let counteredBy4 = 0;
        let counteredBy5 = 0;
        let counteredBy6 = 0;
        Object.values(counters).forEach((counterList) => {
          const count = counterList.length;
          if (count > 0) totalCountered++;
          if (count >= 2) counteredBy2++;
          if (count >= 3) counteredBy3++;
          if (count >= 4) counteredBy4++;
          if (count >= 5) counteredBy5++;
          if (count >= 6) counteredBy6++;
        });
        setSummary({
          total,
          totalCountered,
          counteredBy2,
          counteredBy3,
          counteredBy4,
          counteredBy5,
          counteredBy6,
        });
      }
    } else {
      setSummary(null);
    }
  }, [pokemonTeam, strictCounters, supportMode]);

  if (!summary) {
    return (
      <div className="coverage-summary">
        <h3>{supportMode ? "Support Summary" : "Counter Summary"}</h3>
        <p>No data yet.</p>
      </div>
    );
  }

  if (supportMode) {
    return (
      <div className="support-summary">
        <h3>Support Summary</h3>
        <p>
          {summary.exploitable} out of {summary.total} Pokémon can exploit at least one
          weakness without being countered.
        </p>
      </div>
    );
  }

  return (
    <div className="counter-summary">
      <h3>Counter Summary</h3>
      <p>
        {summary.totalCountered} out of {summary.total} Pokémon are countered
      </p>
      <p>{summary.counteredBy2} countered by 2 or more</p>
      <p>{summary.counteredBy3} countered by 3 or more</p>
      <p>{summary.counteredBy4} countered by 4 or more</p>
      <p>{summary.counteredBy5} countered by 5 or more</p>
      <p>{summary.counteredBy6} countered by 6</p>
    </div>
  );
};

export default CoverageSummary;
