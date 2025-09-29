import gen5Pokemon from "../data/gen5_pokemon.json";



const TYPES = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel'
];

const EFFECTIVENESS = [
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.0, 1.0, 1.0, 0.5],
    [1.0, 0.5, 0.5, 1.0, 2.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 0.5, 1.0, 2.0],
    [1.0, 2.0, 0.5, 1.0, 0.5, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0, 1.0],
    [1.0, 1.0, 2.0, 0.5, 0.5, 1.0, 1.0, 1.0, 0.0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0],
    [1.0, 0.5, 2.0, 1.0, 0.5, 1.0, 1.0, 0.5, 2.0, 0.5, 1.0, 0.5, 2.0, 1.0, 0.5, 1.0, 0.5],
    [1.0, 0.5, 0.5, 1.0, 2.0, 0.5, 1.0, 1.0, 2.0, 2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5],
    [2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0, 0.5, 0.5, 0.5, 2.0, 0.0, 1.0, 2.0, 2.0],
    [1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 0.5, 0.5, 1.0, 1.0, 1.0, 0.5, 0.5, 1.0, 1.0, 0.0],
    [1.0, 2.0, 1.0, 2.0, 0.5, 1.0, 1.0, 2.0, 1.0, 0.0, 1.0, 0.5, 2.0, 1.0, 1.0, 1.0, 2.0],
    [1.0, 1.0, 1.0, 0.5, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 1.0, 1.0, 0.5],
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0, 0.5],
    [1.0, 0.5, 1.0, 1.0, 2.0, 1.0, 0.5, 0.5, 1.0, 0.5, 2.0, 1.0, 1.0, 0.5, 1.0, 2.0, 0.5],
    [1.0, 2.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 0.5, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 2.0, 1.0, 0.5, 0.5],
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5],
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 2.0, 1.0, 0.5, 0.5],
    [1.0, 0.5, 0.5, 0.5, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 0.5]
];

const effectiveness = (attackType, defenderTypes) => {
  const attackIdx = TYPES.indexOf(attackType);
  if (attackIdx === -1) return 1;
  let ans = 1;
  defenderTypes.forEach(defenderType => {
    const defenderIdx = TYPES.indexOf(defenderType);
    if (defenderIdx === -1) return;
    ans *= EFFECTIVENESS[attackIdx][defenderIdx];
  });
  return ans;
};

const isEffective = (attackType, attackerTypes, defenderType) => {
  return effectiveness(attackType, [defenderType]) > 1 &&
         effectiveness(defenderType, attackerTypes) < 1;
};

const isCounter = (attacker, defender) => {
  if (!attacker.moveTypes?.length || !attacker.pokemonTypes?.length) return false;

  const hasSuperEffective = attacker.moveTypes.some(moveType =>
    effectiveness(moveType, defender.types) > 1
  );

  if (!hasSuperEffective) return false;

  const allDefenderStabsIneffective = defender.types.every(stab =>
    effectiveness(stab, attacker.pokemonTypes) < 1
  );

  return hasSuperEffective && allDefenderStabsIneffective;
};

const analyzePokemonCounters = (team) => {
  const result = {};
  gen5Pokemon.forEach(defender => {
    result[defender.name] = [];
    team.forEach(attacker => {
      if (attacker.name && isCounter(attacker, defender)) {
        result[defender.name].push(attacker.name);
      }
    });
  });
  return result;
};

const analyzeTeam = (team) => {
  const defenderIsWeakTo = TYPES.reduce((acc, type) => {
    acc[type] = new Set();
    return acc;
  }, {});
  team.forEach(pokemon => {
    pokemon.moveTypes.forEach(attackType => {
      TYPES.forEach(defenderType => {
        if (isEffective(attackType, pokemon.pokemonTypes, defenderType)) {
          defenderIsWeakTo[defenderType].add(pokemon.name);
        }
      });
    });
  });
  for (const type in defenderIsWeakTo) {
    defenderIsWeakTo[type] = Array.from(defenderIsWeakTo[type]);
  }
  return defenderIsWeakTo;
};

const defendersCovered = (team, n = 1) => {
  const analysisResult = analyzeTeam(team);
  return TYPES.reduce((count, type) => {
    if (analysisResult[type] && analysisResult[type].length >= n) {
      count++;
    }
    return count;
  }, 0);
};

const arrayIsGreater = (arr1, arr2) => {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] > arr2[i]) return true;
    if (arr1[i] < arr2[i]) return false;
  }
  return false;
};

const recommendationsAdd = (team) => {
  let best = [defendersCovered(team, 1), defendersCovered(team, 2), defendersCovered(team, 3)];
  const before = [...best];
  let recommendations = [];
  TYPES.forEach((pkmnType) => {
    const newTeam = [...team, { name: 'XXX', pokemonTypes: [pkmnType], moveTypes: [pkmnType] }];
    const curr = [defendersCovered(newTeam, 1), defendersCovered(newTeam, 2), defendersCovered(newTeam, 3)];
    if (arrayIsGreater(curr, before)) {
      recommendations.push({
        recommendation: `Add ${pkmnType} Pokémon (coverage ${curr.join('/')})`,
        score: curr
      });
    }
  });
  recommendations.sort((a, b) => {
    for (let i = 0; i < a.score.length; i++) {
      if (b.score[i] !== a.score[i]) return b.score[i] - a.score[i];
    }
    return 0;
  });
  return recommendations.slice(0, 10).map(rec => rec.recommendation);
};

const recommendationsReplace = (team) => {
  let best = [defendersCovered(team, 1), defendersCovered(team, 2), defendersCovered(team, 3)];
  const before = [...best];
  let recommendations = [];
  TYPES.forEach((pkmnType) => {
    team.forEach((pokemon, i) => {
      const newTeam = [...team];
      newTeam[i] = { name: 'XXX', pokemonTypes: [pkmnType], moveTypes: [pkmnType] };
      const curr = [defendersCovered(newTeam, 1), defendersCovered(newTeam, 2), defendersCovered(newTeam, 3)];
      if (arrayIsGreater(curr, before)) {
        recommendations.push({
          recommendation: `Add ${pkmnType} move or replace ${pokemon.name} with ${pkmnType} (coverage ${curr.join('/')})`,
          score: curr
        });
      }
    });
  });
  recommendations.sort((a, b) => {
    for (let i = 0; i < a.score.length; i++) {
      if (b.score[i] !== a.score[i]) return b.score[i] - a.score[i];
    }
    return 0;
  });
  return recommendations.slice(0, 10).map(rec => rec.recommendation);
};

const recommendations = (team, teamSize) => {
  let recs;
  if (team.length < teamSize) {
    recs = recommendationsAdd(team);
  } else {
    recs = recommendationsReplace(team);
  }
  return recs.length ? recs : ["None!"];
};

export {
  analyzeTeam,
  defendersCovered,
  recommendations,
  TYPES,
  effectiveness,
  isEffective,
  isCounter,
  analyzePokemonCounters
};