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

/**
 * Computes the effectiveness of the attack type against the defender's types.
 * @param {string} attackType The attack type.
 * @param {Array<string>} defenderTypes An array of the defender's types (max 2).
 * @returns {float} The multiplier of the attack against the defender.
 */
const effectiveness = (attackType, defenderTypes) => {
    const attackIdx = TYPES.indexOf(attackType);
    let ans = 1;

    defenderTypes.forEach(defenderType => {
        const defenderIdx = TYPES.indexOf(defenderType);
        ans *= EFFECTIVENESS[attackIdx][defenderIdx];
    });

    return ans;
};

/**
 * Returns whether the attacker's attack is effective against the defender. Effective is defined as the attack having a > 1 multiplier against the defender, while the defender's STAB attack has a <= 1 multiplier against the attacker.
 * @param {string} attackType The attack type.
 * @param {Array<string>} attackerTypes An array of the attacker's types (max 2).
 * @param {Array<string>} defenderType An array of the defender's types (max 2).
 * @returns {boolean} Whether the atttacker's attack is effective against the defender.
 */
const isEffective = (attackType, attackerTypes, defenderType) => {
    return effectiveness(attackType, [defenderType]) > 1 && effectiveness(defenderType, attackerTypes) < 1;
};

/**
 * Analyzes the Pokemon team and returns which Pokemon are effective against which types.
 * @param {Array<Object<string, any>} team The pokemon team.
 * @returns {Object<string, Array<string>>} An object describing which Pokemon are effective against which types.
 */
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

/**
 * Computes the number of types that are countered by at least n Pokemon.
 * @param {Object<string, Array<string>>} analysisResult An object describing which Pokemon are effective against which types.
 * @param {int} n
 * @returns {int} The number of types that are countered by at least n Pokemon.
 */
const defendersCovered = (team, n = 1) => {
    const analysisResult = analyzeTeam(team);
    return TYPES.reduce((count, type) => {
        if (analysisResult[type] && analysisResult[type].length >= n) {
            count++;
        }
        return count;
    }, 0);
};

/**
 * Compares two arrays element-wise to determine if the first array is greater than the second.
 * The comparison is done in lexicographical order: if an element in arr1 is greater than the corresponding element in arr2, the function returns true.
 * If an element in arr1 is less than the corresponding element in arr2, the function returns false.
 * If all elements are equal, the function returns false.
 *
 * @param {Array<number>} arr1 - The first array to compare.
 * @param {Array<number>} arr2 - The second array to compare.
 * @returns {boolean} - True if arr1 is greater than arr2, false otherwise.
 */
const arrayIsGreater = (arr1, arr2) => {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] > arr2[i]) return true;
        if (arr1[i] < arr2[i]) return false;
    }
    return false;
};

/**
 * Returns a list of recommendations about which Pokemon to add.
 * @param {Array<Object<string, any>} team The Pokemon team.
 * @returns {Array<string>} A list of recommendations about which Pokemon to add.
 */
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

    // Sort recommendations by score in descending order and take the top 10
    recommendations.sort((a, b) => {
        for (let i = 0; i < a.score.length; i++) {
            if (b.score[i] !== a.score[i]) {
                return b.score[i] - a.score[i];
            }
        }
        return 0;
    });

    return recommendations.slice(0, 10).map(rec => rec.recommendation);
};

/**
 * Returns a list of recommendations about which Pokemon to replace.
 * @param {Array<Object<string, any>} team The Pokemon team.
 * @returns {Array<string>} A list of recommendations about which Pokemon to replace.
 */
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

    // Sort recommendations by score in descending order and take the top 10
    recommendations.sort((a, b) => {
        for (let i = 0; i < a.score.length; i++) {
            if (b.score[i] !== a.score[i]) {
                return b.score[i] - a.score[i];
            }
        }
        return 0;
    });

    return recommendations.slice(0, 10).map(rec => rec.recommendation);
};

/**
 * Returns a list of recommendations based on the Pokemon team.
 * @param {Array<Object<string, any>} team The Pokemon team.
 * @param {int} teamSize The max team size.
 * @returns {Array<string>} A list of recommendations.
 */
const recommendations = (team, teamSize) => {
    let recs;
    if (team.length < teamSize) {
        recs = recommendationsAdd(team);
    } else {
        recs = recommendationsReplace(team);
    }

    return recs.length ? recs : ["None!"];
};

export { analyzeTeam, defendersCovered, recommendations, TYPES };
