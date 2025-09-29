import fs from "fs";

const GEN5_START = 495;
const GEN5_END = 649;
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
  for (let id = GEN5_START; id <= GEN5_END; id++) {
    const p = await fetchPokemon(id);
    if (p) results.push(p);
  }
  fs.writeFileSync("src/data/gen5_pokemon.json", JSON.stringify(results, null, 2));
  console.log("Gen 5 data saved with sprites + icons to src/data/gen5_pokemon.json");
}

main();
