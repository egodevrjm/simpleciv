import React, { useEffect } from 'react';
import './MapTile.css';
import { PLAYERS } from '../constants';

const MapTile = ({ x, y, terrain, isRevealed, unit, city, isSelected, onClick }) => {
  // For debugging unit rendering - MUST BE BEFORE ANY RETURN STATEMENTS
  useEffect(() => {
    if (isRevealed && unit) {
      console.log(`Unit at (${x},${y}): ${unit.type}`);
    }
  }, [isRevealed, x, y, unit]);

  if (!isRevealed) {
    return <div className="map-tile fog-of-war" onClick={onClick}></div>;
  }

  const terrainClass = terrain.name.toLowerCase().replace(/\s+/g, '-');
  const selectionClass = isSelected ? 'selected' : '';

  // Determine unit styles based on player
  const getUnitStyle = (unit) => {
    const isHumanUnit = unit.player === 'human';
    const playerColor = PLAYERS[unit.player.toUpperCase()]?.color || '#888888';
    return { 
      backgroundColor: playerColor,
      boxShadow: isHumanUnit ? '0 0 10px #FFF, 0 0 20px #FFD700' : 'none',
      border: isHumanUnit ? '3px solid #FFFFFF' : '2px solid white'
    };
  };

  // Determine city styles based on player
  const getCityStyle = (city) => {
    const isHumanCity = city.player === 'human';
    const playerColor = PLAYERS[city.player.toUpperCase()]?.color || '#888888';
    return { 
      borderColor: playerColor,
      boxShadow: isHumanCity ? '0 0 10px #FFF, 0 0 20px #FFD700' : 'none' 
    };
  };

  // Get unit icon based on type
  const getUnitIcon = (unitType) => {
    switch(unitType.toLowerCase()) {
      case 'settler': return '👨‍👩‍👧';
      case 'warrior': return '⚔️';
      case 'archer': return '🏹';
      case 'scout': return '👁️';
      default: return '▣';
    }
  };

  return (
    <div 
      className={`map-tile ${terrainClass} ${selectionClass}`} 
      onClick={onClick}
      data-coords={`${x},${y}`}
    >
      <div className="terrain-details">
        {terrain.name.charAt(0).toUpperCase()}
      </div>

      {city && (
        <div className="city" style={getCityStyle(city)}>
          <div className="city-icon">🏛️</div>
          <div className="city-name">{city.name}</div>
          {city.player === 'human' && <div className="player-indicator">YOUR CITY</div>}
        </div>
      )}

      {unit && !city && (
        <div className="unit" style={getUnitStyle(unit)}>
          <div className="unit-icon">{getUnitIcon(unit.type)}</div>
          {unit.player === 'human' && <div className="your-unit-badge">✓</div>}
        </div>
      )}

      {unit && city && (
        <div className="unit unit-with-city" style={getUnitStyle(unit)}>
          <div className="unit-icon">{getUnitIcon(unit.type)}</div>
          {unit.player === 'human' && <div className="your-unit-badge small">✓</div>}
        </div>
      )}
    </div>
  );
};

export default MapTile;