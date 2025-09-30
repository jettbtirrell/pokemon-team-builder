import gen5Pokemon from "../data/gen5_pokemon.json";
import allPokemon from "../data/all_pokemon.json";

const TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic",
  "bug", "rock", "ghost", "dragon", "dark", "steel"
];

const EFFECTIVENESS = [
  [1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.5,0.0,1.0,1.0,0.5],
  [1.0,0.5,0.5,1.0,2.0,2.0,1.0,1.0,1.0,1.0,1.0,2.0,0.5,1.0,0.5,1.0,2.0],
  [1.0,2.0,0.5,1.0,0.5,1.0,1.0,1.0,2.0,1.0,1.0,1.0,2.0,1.0,0.5,1.0,1.0],
  [1.0,1.0,2.0,0.5,0.5,1.0,1.0,1.0,0.0,2.0,1.0,1.0,1.0,1.0,0.5,1.0,1.0],
  [1.0,0.5,2.0,1.0,0.5,1.0,1.0,0.5,2.0,0.5,1.0,0.5,2.0,1.0,0.5,1.0,0.5],
  [1.0,0.5,0.5,1.0,2.0,0.5,1.0,1.0,2.0,2.0,1.0,1.0,1.0,1.0,2.0,1.0,0.5],
  [2.0,1.0,1.0,1.0,1.0,2.0,1.0,0.5,1.0,0.5,0.5,0.5,2.0,0.0,1.0,2.0,2.0],
  [1.0,1.0,1.0,1.0,2.0,1.0,1.0,0.5,0.5,1.0,1.0,1.0,0.5,0.5,1.0,1.0,0.0],
  [1.0,2.0,1.0,2.0,0.5,1.0,1.0,2.0,1.0,0.0,1.0,0.5,2.0,1.0,1.0,1.0,2.0],
  [1.0,1.0,1.0,0.5,2.0,1.0,2.0,1.0,1.0,1.0,1.0,2.0,0.5,1.0,1.0,1.0,0.5],
  [1.0,1.0,1.0,1.0,1.0,1.0,2.0,2.0,1.0,1.0,0.5,1.0,1.0,1.0,1.0,0.0,0.5],
  [1.0,0.5,1.0,1.0,2.0,1.0,0.5,0.5,1.0,0.5,2.0,1.0,1.0,0.5,1.0,2.0,0.5],
  [1.0,2.0,1.0,1.0,1.0,2.0,0.5,1.0,0.5,2.0,1.0,2.0,1.0,1.0,1.0,1.0,0.5],
  [0.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,2.0,1.0,1.0,2.0,1.0,0.5,0.5],
  [1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,2.0,1.0,0.5],
  [1.0,1.0,1.0,1.0,1.0,1.0,0.5,1.0,1.0,1.0,2.0,1.0,1.0,2.0,1.0,0.5,0.5],
  [1.0,0.5,0.5,0.5,1.0,2.0,1.0,1.0,1.0,1.0,1.0,1.0,0.5,1.0,1.0,1.0,0.5]
];

const getDataset = (allGens) => (allGens ? allPokemon : gen5Pokemon);

const effectiveness = (attackType, defenderTypes) => {
  const attackIdx = TYPES.indexOf(attackType);
  if (attackIdx === -1) return 1;
  return defenderTypes.reduce((acc, def) => {
    const defIdx = TYPES.indexOf(def);
    return defIdx === -1 ? acc : acc * EFFECTIVENESS[attackIdx][defIdx];
  }, 1);
};

const isCounter = (attacker, defender, strict = true) => {
  if (!attacker.moveTypes?.length || !attacker.pokemonTypes?.length) return false;
  const hasSE = attacker.moveTypes.some(m => effectiveness(m, defender.types) > 1);
  if (!hasSE) return false;
  if (strict) {
    return defender.types.every(stab => effectiveness(stab, attacker.pokemonTypes) < 1);
  } else {
    return defender.types.every(stab => effectiveness(stab, attacker.pokemonTypes) <= 1);
  }
};

const analyzePokemonCounters = (team, strictCounters = true, dataset = gen5Pokemon) => {
  const result = {};
  dataset.forEach(defender => {
    result[defender.name] = { counters: [], weaknesses: [] };
    team.forEach(attacker => {
      if (!attacker.name) return;
      if (isCounter(attacker, defender, strictCounters)) {
        result[defender.name].counters.push(attacker.name);
      }
      const hasSE = defender.types.some(type =>
        effectiveness(type, attacker.pokemonTypes) > 1
      );
      if (hasSE) result[defender.name].weaknesses.push(attacker.name);
    });
  });
  return result;
};

const analyzeSupportThreats = (team, dataset = gen5Pokemon) => {
  const result = {};
  dataset.forEach(defender => {
    result[defender.name] = [];
    team.forEach(attacker => {
      if (!attacker.pokemonTypes?.length) return;
      const hasSEStab = defender.types.some(stab =>
        effectiveness(stab, attacker.pokemonTypes) > 1
      );
      if (hasSEStab) result[defender.name].push(attacker.name);
    });
  });
  return result;
};

const countCounteredOnce = (team, strictCounters = true, dataset = gen5Pokemon) => {
  const mapping = analyzePokemonCounters(team, strictCounters, dataset);
  let count = 0;
  Object.values(mapping).forEach(obj => { if (obj.counters.length > 0) count++; });
  return { count, total: dataset.length, mapping };
};

const coverageSummary = (team, strictCounters = true, dataset = gen5Pokemon) => {
  const counters = analyzePokemonCounters(team, strictCounters, dataset);
  const total = Object.keys(counters).length;
  let totalCountered = 0, counteredBy2 = 0, counteredBy3 = 0, counteredBy4 = 0, counteredBy5 = 0, counteredBy6 = 0;
  Object.values(counters).forEach(obj => {
    const count = obj.counters.length;
    if (count > 0) totalCountered++;
    if (count >= 2) counteredBy2++;
    if (count >= 3) counteredBy3++;
    if (count >= 4) counteredBy4++;
    if (count >= 5) counteredBy5++;
    if (count >= 6) counteredBy6++;
  });
  return { total, totalCountered, counteredBy2, counteredBy3, counteredBy4, counteredBy5, counteredBy6 };
};

const analyzeTeam = (team) => {
  const defenderIsWeakTo = TYPES.reduce((acc, type) => {
    acc[type] = new Set();
    return acc;
  }, {});
  team.forEach(pokemon => {
    pokemon.moveTypes.forEach(attackType => {
      TYPES.forEach(defenderType => {
        if (effectiveness(attackType, [defenderType]) > 1) {
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
    if (analysisResult[type] && analysisResult[type].length >= n) count++;
    return count;
  }, 0);
};

const recommendAdditions = (team, topN = 30, strictCounters = true, allGens = false) => {
  const dataset = getDataset(allGens);
  const base = countCounteredOnce(team, strictCounters, dataset);
  const baseCount = base.count;
  const results = dataset.map(p => {
    const simTeam = [...team, { name: p.name, moveTypes: p.types, pokemonTypes: p.types }];
    const sim = countCounteredOnce(simTeam, strictCounters, dataset);
    return {
      name: p.name, id: p.id, sprite: p.sprite,
      delta: sim.count - baseCount,
      newCount: sim.count
    };
  }).filter(r => r.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, topN);
  return { baseCount, total: dataset.length, results };
};

const recommendSupportAdditions = (team, topN = 30, strict = true, allGens = false) => {
  const dataset = getDataset(allGens);
  const baseCounters = analyzePokemonCounters(team, strict, dataset);
  const baseSupport = analyzeSupportThreats(team, dataset);
  const problemEnemies = Object.entries(baseSupport)
    .filter(([enemy, weakList]) =>
      weakList.length > 0 && (!baseCounters[enemy] || baseCounters[enemy].counters.length === 0)
    )
    .map(([enemy]) => enemy);
  const results = dataset.map(p => {
    const simTeam = [...team, { name: p.name, moveTypes: p.types, pokemonTypes: p.types }];
    const simCounters = analyzePokemonCounters(simTeam, strict, dataset);
    const fixes = problemEnemies.filter(enemy =>
      simCounters[enemy] && simCounters[enemy].counters.includes(p.name)
    ).length;
    return { name: p.name, id: p.id, sprite: p.sprite, fixes };
  }).filter(r => r.fixes > 0)
    .sort((a, b) => b.fixes - a.fixes)
    .slice(0, topN);
  return {
    problemCount: problemEnemies.length,
    results,
    percentMitigated: problemEnemies.length > 0
      ? Math.round((results[0]?.fixes || 0) / problemEnemies.length * 100)
      : 0
  };
};

export {
  TYPES,
  effectiveness,
  isCounter,
  analyzePokemonCounters,
  analyzeSupportThreats,
  coverageSummary,
  countCounteredOnce,
  recommendAdditions,
  recommendSupportAdditions,
  analyzeTeam,
  defendersCovered
};
