import React from "react";
import { coverageSummary } from "../analysis";

const CoverageSummary = ({ pokemonTeam }) => {
  if (!pokemonTeam || pokemonTeam.length === 0) {
    return (
      <div className="coverage-summary">
        <h3>Coverage Summary</h3>
        <p>No data yet.</p>
      </div>
    );
  }

  const summary = coverageSummary(pokemonTeam);

  return (
  <div className="counter-summary">
    <h3>Counter Summary</h3>
      <p>{summary.totalCountered} out of {summary.total} Pokémon are countered</p>
      <p>{summary.counteredBy2} countered by 2 or more</p>
      <p>{summary.counteredBy3} countered by 3 or more</p>
      <p>{summary.counteredBy4} countered by 4 or more</p>
      <p>{summary.counteredBy5} countered by 5 or more</p>
      <p>{summary.counteredBy6} countered by 6</p>
    </div>
  );
};

export default CoverageSummary;