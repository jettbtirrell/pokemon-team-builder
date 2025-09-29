import React from "react";
import PokemonPicker from "./PokemonPicker/PokemonPicker";
import "./PokemonTeam.css";

const PokemonTeam = ({ numPickers, onPickerChange, pokemonTeam, animationsEnabled }) => {
  return (
    <div className="pokemon-team">
      {pokemonTeam.map((p, i) => (
        <PokemonPicker
          key={i}
          onPickerChange={onPickerChange(i)}
          initialPokemon={p.name}
          initialTypes={p.moveTypes}
          animationsEnabled={animationsEnabled}
        />
      ))}
    </div>
  );
};

export default PokemonTeam;
