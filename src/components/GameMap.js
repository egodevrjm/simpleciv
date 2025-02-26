import React, { useState, useEffect, useRef } from 'react';
import MapTile from './MapTile';
import './GameMap.css';

const GameMap = ({ 
  map, 
  units, 
  cities, 
  selectedUnit, 
  selectedCity,
  revealedTiles, 
  onTileClick 
}) => {
  const [hoveredCoords, setHoveredCoords] = useState(null);
  const mapContainerRef = useRef(null);
  
  // Function to center the map on a specific tile
  const centerOnTile = (x, y) => {
    if (!mapContainerRef.current) return;
    
    const tileSize = 60; // Matching our CSS tile size
    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;
    
    const scrollX = x * tileSize - (containerWidth / 2) + (tileSize / 2);
    const scrollY = y * tileSize - (containerHeight / 2) + (tileSize / 2);
    
    mapContainerRef.current.scrollTo({
      left: scrollX,
      top: scrollY,
      behavior: 'smooth'
    });
  };

  // Set initial focus position when map first loads
  useEffect(() => {
    if (map && map.length > 0 && units && units.length > 0) {
      // Find player unit to focus on
      const playerUnit = units.find(unit => unit.player === 'human');
      if (playerUnit) {
        setTimeout(() => {
          centerOnTile(playerUnit.x, playerUnit.y);
        }, 300); // Small delay to ensure map is rendered
      }
    }
  }, [map, units]); // Run when map or units change
  
  // Center on selected unit or city when they change
  useEffect(() => {
    if (selectedUnit) {
      centerOnTile(selectedUnit.x, selectedUnit.y);
    } else if (selectedCity) {
      centerOnTile(selectedCity.x, selectedCity.y);
    }
  }, [selectedUnit, selectedCity]);
  
  // Track mouse position on the map
  const handleMouseMove = (e) => {
    if (e.target.dataset.coords) {
      setHoveredCoords(e.target.dataset.coords);
    } else {
      setHoveredCoords(null);
    }
  };
  
  if (!map || map.length === 0) {
    return <div className="game-map">No map available</div>;
  }

  return (
    <div className="map-scroll-container" ref={mapContainerRef} onMouseMove={handleMouseMove}>
      <div className="game-map">
        {map.map((row, y) => (
          <div key={`row-${y}`} className="map-row">
            {row.map((terrain, x) => {
              const isRevealed = revealedTiles[`${x},${y}`];
              const unit = units.find(u => u.x === x && u.y === y);
              const city = cities.find(c => c.x === x && c.y === y);
              const isSelected = 
                (selectedUnit && selectedUnit.x === x && selectedUnit.y === y) || 
                (selectedCity && selectedCity.x === x && selectedCity.y === y);
              
              return (
                <MapTile
                  key={`tile-${x}-${y}`}
                  x={x}
                  y={y}
                  terrain={terrain}
                  isRevealed={isRevealed}
                  unit={unit}
                  city={city}
                  isSelected={isSelected}
                  onClick={() => onTileClick(x, y)}
                />
              );
            })}
          </div>
        ))}
      </div>
      {hoveredCoords && (
        <div className="map-coordinates">
          Coordinates: {hoveredCoords}
        </div>
      )}
    </div>
  );
};

export default GameMap;