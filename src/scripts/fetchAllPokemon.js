import fs from "fs";

const GEN_START = 1;
const GEN_END = 649;
const URL = "https://pokeapi.co/api/v2/pokemon/";
const ICON_BASE = "https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen7x/regular/";

async function fetchPokemon(id) {
  const res = await fetch(`${URL}${id}`);
  if (!res.ok) {
    console.error(`Failed to fetch ${id}`);
    return null;
  }

  const data = await res.json();
  const name = data.name.toLowerCase();

  return {
    id: data.id,
    name,
    types: data.types.map(t => t.type.name),
    sprite: data.sprites.front_default,
    icon: `${ICON_BASE}${name}.png`
  };
}

async function main() {
  const results = [];
  for (let id = GEN_START; id <= GEN_END; id++) {
    console.log(`Fetching Pokémon #${id}...`);
    const p = await fetchPokemon(id);
    if (p) results.push(p);
  }

  fs.writeFileSync("src/data/all_pokemon.json", JSON.stringify(results, null, 2));
  console.log(`Saved ${results.length} Pokémon to src/data/all_pokemon.json`);
}

main();
