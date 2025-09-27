import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './TypeCoverage.css';
import { analyzeTeam, TYPES, defendersCovered } from '../analysis';
import TypeIcon from '../TypeIcon/TypeIcon';

const TypeCoverage = ({ pokemonTeam }) => {
  const [analysisResult, setAnalysisResult] = useState({});

  useEffect(() => {
    const result = analyzeTeam(pokemonTeam);
    setAnalysisResult(result);
  }, [pokemonTeam]);

  const totalTypes = TYPES.length;
  const coveredByOne = defendersCovered(pokemonTeam, 1);
  const coveredByTwo = defendersCovered(pokemonTeam, 2);
  const coveredByThree = defendersCovered(pokemonTeam, 3);

  return (
    <div className="type-coverage">
      <div className="type-coverage-scroll">
        <p className="mb-2">
          You can counter <b>[this type]</b> using:
          <FontAwesomeIcon icon={faInfoCircle} data-tooltip-id="infoTooltip" className="info-icon" />
        </p>
        <Tooltip id="infoTooltip" place="top" effect="solid" className="custom-tooltip">
          An effective counter is defined as a Pokémon whose damaging moves are super effective against the target, AND the target's STAB moves are have less than neutral effectiveness against the Pokémon.
        </Tooltip>
        {TYPES.map((type) => (
          <div key={type} className="type-coverage-row">
            <TypeIcon type={type} />
            <span className="effective-pokemon ms-2">
              {analysisResult[type] && analysisResult[type].join(', ')}
            </span>
          </div>
        ))}
        <div className="summary-stats">
          <p><b>Types that are countered by 1 Pokémon</b>: {coveredByOne} of {totalTypes}</p>
          <p><b>Types that are countered by 2 Pokémon</b>: {coveredByTwo} of {totalTypes}</p>
          <p><b>Types that are countered by 3 Pokémon</b>: {coveredByThree} of {totalTypes}</p>
          <p><b>Overall coverage score</b>: {coveredByOne}/{coveredByTwo}/{coveredByThree}</p>
        </div>
      </div>
    </div>
  );
};

export default TypeCoverage;
