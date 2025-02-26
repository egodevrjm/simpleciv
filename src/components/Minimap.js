import React, { useRef, useEffect } from 'react';
import './Minimap.css';
import { TERRAIN_TYPES } from '../constants';

const Minimap = ({ map, units, cities, revealedTiles, viewportRef, onViewportChange }) => {
  const canvasRef = useRef(null);
  
  // Draw the minimap
  useEffect(() => {
    if (!map || map.length === 0 || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const tileSize = canvas.width / map[0].length;
    
    // Clear the canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the map
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        const isRevealed = revealedTiles[`${x},${y}`];
        
        if (isRevealed) {
          // Draw terrain
          const terrain = map[y][x];
          ctx.fillStyle = terrain.color;
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        } else {
          // Draw fog of war
          ctx.fillStyle = '#111';
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    }
    
    // Draw cities
    cities.forEach(city => {
      if (revealedTiles[`${city.x},${city.y}`]) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(
          city.x * tileSize + tileSize / 2,
          city.y * tileSize + tileSize / 2,
          tileSize * 1.2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        
        // City owner color
        ctx.fillStyle = city.player === 'human' ? '#4CAF50' : '#FF5722';
        ctx.beginPath();
        ctx.arc(
          city.x * tileSize + tileSize / 2,
          city.y * tileSize + tileSize / 2,
          tileSize,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    });
    
    // Draw units
    units.forEach(unit => {
      if (revealedTiles[`${unit.x},${unit.y}`]) {
        ctx.fillStyle = unit.player === 'human' ? '#4CAF50' : '#FF5722';
        ctx.fillRect(
          unit.x * tileSize,
          unit.y * tileSize,
          tileSize,
          tileSize
        );
      }
    });
    
    // Draw viewport rectangle if reference is available
    if (viewportRef && viewportRef.current) {
      const { scrollLeft, scrollTop, clientWidth, clientHeight, scrollWidth, scrollHeight } = viewportRef.current;
      
      // Calculate viewport position and size relative to the whole map
      const vpX = (scrollLeft / scrollWidth) * canvas.width;
      const vpY = (scrollTop / scrollHeight) * canvas.height;
      const vpWidth = (clientWidth / scrollWidth) * canvas.width;
      const vpHeight = (clientHeight / scrollHeight) * canvas.height;
      
      // Draw viewport indicator
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(vpX, vpY, vpWidth, vpHeight);
    }
  }, [map, units, cities, revealedTiles, viewportRef]);
  
  // Handle click on minimap
  const handleMinimapClick = (e) => {
    if (!map || map.length === 0 || !canvasRef.current || !viewportRef || !viewportRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate click position relative to canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to map percentage
    const percentX = x / canvas.width;
    const percentY = y / canvas.height;
    
    if (onViewportChange) {
      onViewportChange(percentX, percentY);
    }
  };
  
  return (
    <div className="minimap-container">
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={200} 
        className="minimap-canvas"
        onClick={handleMinimapClick}
      />
    </div>
  );
};

export default Minimap;