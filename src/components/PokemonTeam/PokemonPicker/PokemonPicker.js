import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import pokemon from 'pokemon';
import './PokemonPicker.css';
import TypesList from './TypesList/TypesList';
import TypeIcon from '../../TypeIcon/TypeIcon';

const PokemonPicker = ({ onPickerChange, initialPokemon, initialTypes }) => {
  const [selectedPokemon, setSelectedPokemon] = useState(initialPokemon ? { label: initialPokemon, value: initialPokemon } : null);
  const [selectedTypes, setSelectedTypes] = useState(initialTypes || []);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [isShiny, setIsShiny] = useState(false);
  const [pokemonSprites, setPokemonSprites] = useState({ normal: '', shiny: '' });


  const pokemonOptions = pokemon.all().slice(0, 649).sort().map((name) => ({
    label: name,
    value: name,
  }));

  useEffect(() => {
    if (initialPokemon) {
      setSelectedPokemon({ label: initialPokemon, value: initialPokemon });
      fetchPokemonData(initialPokemon);
    }
  }, [initialPokemon]);

  useEffect(() => {
    setSelectedTypes(initialTypes || []);
  }, [initialTypes]);

  const handlePokemonChange = async (selectedOption) => {
    const name = selectedOption ? selectedOption.value : '';
    setSelectedPokemon(selectedOption);
    onPickerChange(name, selectedTypes);

    if (!name) {
      setPokemonSprites({ normal: '', shiny: '' });
      setPokemonTypes([]);
    } else {
      await fetchPokemonData(name);
    }
  };

  const handleTypeToggle = (type, isSelected) => {
    const newTypes = isSelected
      ? [...selectedTypes, type]
      : selectedTypes.filter((t) => t !== type);
    setSelectedTypes(newTypes);
    onPickerChange(selectedPokemon ? selectedPokemon.value : '', newTypes);
  };

  const fetchPokemonData = async (name) => {
    if (!name) {
      return; // Do nothing if the name is empty
    }

    try {
      const pokemonId = pokemon.getId(name);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const data = await response.json();

      const gen5Animated = data.sprites?.versions?.["generation-v"]?.["black-white"]?.animated;

      const normalSprite =
        gen5Animated?.front_default || data.sprites.front_default;

      const shinySprite =
        gen5Animated?.front_shiny || data.sprites.front_shiny;

      setPokemonSprites({ normal: normalSprite, shiny: shinySprite });

      let types = data.types.map(typeInfo => typeInfo.type.name);

      const pastTypes = data.past_types.find(pt => pt.generation.name === 'generation-v');
      if (pastTypes) {
        types = pastTypes.types.map(typeInfo => typeInfo.type.name);
      }

      setPokemonTypes(types);
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
      setPokemonSprites({ normal: "", shiny: "" });
      setPokemonTypes([]);
    }
  };

  return (
    <div className="pokemon-picker">
      <Select
        classNamePrefix="react-select"
        value={selectedPokemon}
        onChange={handlePokemonChange}
        options={pokemonOptions}
        isClearable
        placeholder="Select"
      />
      <div className="pokemon-types">
        {pokemonTypes.map(type => (
          <TypeIcon key={type} type={type} />
        ))}
      </div>
      <div className="pokemon-image-box">
        {pokemonSprites.normal && (
          <>
            <img
              src={isShiny ? pokemonSprites.shiny : pokemonSprites.normal}
              alt={selectedPokemon ? selectedPokemon.label : ''}
              className="pokemon-image"
              onError={() => setPokemonSprites({ normal: '', shiny: '' })}
            />
            {pokemonSprites.shiny && (
              <button
                className="shiny-toggle"
                onClick={() => {console.log("clicked, new state:", !isShiny); setIsShiny((prev) => !prev)}}
              >
                {isShiny ? '⚪ Normal' : '🌟 Shiny'}
              </button>
            )}
          </>
        )}
      </div>
      <p className="">Damaging Moves:</p>
      <TypesList selectedTypes={selectedTypes} onTypeToggle={handleTypeToggle} />
    </div>
  );
};

export default PokemonPicker;
