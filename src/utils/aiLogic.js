import { UNIT_TYPES, TERRAIN_TYPES } from '../constants';

// Perform an AI turn
export const performAiTurn = (aiPlayerId, gameState) => {
  const {
    map,
    units,
    cities,
    revealedTiles,
    turnNumber
  } = gameState;
  
  // Create copies of game state that we'll modify
  let updatedUnits = [...units];
  let updatedCities = [...cities];
  let updatedRevealedTiles = { ...revealedTiles };
  
  // Get AI units and cities
  const aiUnits = units.filter(unit => unit.player === aiPlayerId);
  const aiCities = cities.filter(city => city.player === aiPlayerId);
  
  // Process cities
  updatedCities = processCities(aiCities, updatedUnits, map, aiPlayerId, turnNumber);
  
  // Process units
  const unitActions = processUnits(aiUnits, units, cities, map, revealedTiles, aiPlayerId);
  updatedUnits = unitActions.units;
  
  // Update revealed tiles for AI (just for consistency)
  for (const unit of aiUnits) {
    for(let dy = -1; dy <= 1; dy++) {
      for(let dx = -1; dx <= 1; dx++) {
        const nx = unit.x + dx;
        const ny = unit.y + dy;
        if (nx >= 0 && ny >= 0 && nx < map[0].length && ny < map.length) {
          updatedRevealedTiles[`${nx},${ny}`] = true;
        }
      }
    }
  }
  
  return {
    units: updatedUnits,
    cities: updatedCities,
    revealedTiles: updatedRevealedTiles,
    combatResults: unitActions.combatResults,
    foundedCities: unitActions.foundedCities
  };
};

// Process AI cities
const processCities = (aiCities, units, map, aiPlayerId, turnNumber) => {
  return aiCities.map(city => {
    // Update city resources
    let updatedCity = { ...city };
    
    // Add food
    updatedCity.food += updatedCity.foodPerTurn;
    
    // Check for population growth
    if (updatedCity.food >= updatedCity.foodNeeded) {
      updatedCity.population += 1;
      updatedCity.food = 0;
      updatedCity.foodNeeded = 10 + (updatedCity.population * 5);
      updatedCity.sciencePerTurn += 1;
    }
    
    // Process production
    if (!updatedCity.currentProduction) {
      // Choose what to produce
      const production = chooseProduction(city, units, map, aiPlayerId, turnNumber);
      updatedCity.currentProduction = production;
    } else {
      updatedCity.production += updatedCity.productionPerTurn;
      
      // Check if production is complete
      const { type, id } = updatedCity.currentProduction;
      let productionCost = 0;
      
      // Get production cost
      if (type === 'unit') {
        const unitType = Object.values(UNIT_TYPES).find(u => u.name === id);
        if (unitType) productionCost = unitType.productionCost;
      }
      
      if (updatedCity.production >= productionCost) {
        // Production is complete
        if (type === 'unit') {
          // Create the new unit (will be added outside this function)
          units.push({
            x: updatedCity.x,
            y: updatedCity.y,
            type: id,
            player: aiPlayerId,
            movesLeft: 0
          });
          
          // Reset production
          updatedCity.production = 0;
          updatedCity.currentProduction = null;
        }
      }
    }
    
    return updatedCity;
  });
};

// Choose what to produce in a city
const chooseProduction = (city, units, map, aiPlayerId, turnNumber) => {
  const aiUnits = units.filter(unit => unit.player === aiPlayerId);
  
  // Count unit types
  const unitCounts = {};
  aiUnits.forEach(unit => {
    unitCounts[unit.type] = (unitCounts[unit.type] || 0) + 1;
  });
  
  // Early game: focus on settlers and warriors
  if (turnNumber < 30) {
    // If we have less than 2 settlers, build one
    if ((unitCounts['settler'] || 0) < 2) {
      return { type: 'unit', id: 'settler' };
    }
    
    // Otherwise build warriors
    if ((unitCounts['warrior'] || 0) < 3) {
      return { type: 'unit', id: 'warrior' };
    }
    
    // Then build an archer
    if ((unitCounts['archer'] || 0) < 1) {
      return { type: 'unit', id: 'archer' };
    }
  } else {
    // Mid game: more balanced approach
    // Keep expanding with settlers occasionally
    if ((unitCounts['settler'] || 0) < 4 && Math.random() < 0.3) {
      return { type: 'unit', id: 'settler' };
    }
    
    // Build more military
    const warriorChance = 0.5;
    const archerChance = 0.3;
    const scoutChance = 0.2;
    
    const roll = Math.random();
    if (roll < warriorChance) {
      return { type: 'unit', id: 'warrior' };
    } else if (roll < warriorChance + archerChance) {
      return { type: 'unit', id: 'archer' };
    } else {
      return { type: 'unit', id: 'scout' };
    }
  }
  
  // Default to warriors
  return { type: 'unit', id: 'warrior' };
};

// Process AI units
const processUnits = (aiUnits, allUnits, cities, map, revealedTiles, aiPlayerId) => {
  let updatedUnits = [...allUnits];
  const combatResults = [];
  const foundedCities = [];
  
  // Shuffle units to avoid predictable order
  const shuffledAiUnits = [...aiUnits].sort(() => 0.5 - Math.random());
  
  for (const unit of shuffledAiUnits) {
    // Skip units that have already moved
    if (unit.movesLeft <= 0) continue;
    
    // Get index in the main units array
    const unitIndex = updatedUnits.findIndex(u => u.x === unit.x && u.y === unit.y && u.type === unit.type);
    if (unitIndex === -1) continue; // Unit not found
    
    // Get current unit (it might have been updated by previous actions)
    const currentUnit = updatedUnits[unitIndex];
    
    // Choose action based on unit type
    switch (currentUnit.type) {
      case 'settler':
        // Try to found a city
        const shouldFound = shouldFoundCity(currentUnit, cities, map);
        if (shouldFound) {
          // Found city
          const cityName = `AI City ${cities.filter(c => c.player === aiPlayerId).length + 1}`;
          foundedCities.push({
            x: currentUnit.x,
            y: currentUnit.y,
            name: cityName,
            player: aiPlayerId
          });
          
          // Remove the settler
          updatedUnits = updatedUnits.filter((_, index) => index !== unitIndex);
        } else {
          // Move towards good city location
          const { newX, newY } = moveTowardsCityLocation(currentUnit, cities, map, updatedUnits);
          
          if (newX !== currentUnit.x || newY !== currentUnit.y) {
            updatedUnits[unitIndex] = {
              ...currentUnit,
              x: newX,
              y: newY,
              movesLeft: 0
            };
          }
        }
        break;
        
      case 'warrior':
      case 'archer':
        // Look for enemy units to attack
        const enemyUnit = findAdjacentEnemyUnit(currentUnit, updatedUnits, aiPlayerId);
        
        if (enemyUnit) {
          // Attack the enemy
          const combatResult = resolveCombat(currentUnit, enemyUnit, updatedUnits);
          combatResults.push(combatResult);
          
          // Update units based on combat result
          if (combatResult.victorId === currentUnit.player) {
            // AI won, remove enemy unit
            updatedUnits = updatedUnits.filter(u => u !== enemyUnit);
            updatedUnits[unitIndex].movesLeft = 0;
          } else {
            // AI lost, remove AI unit
            updatedUnits = updatedUnits.filter((_, index) => index !== unitIndex);
          }
        } else {
          // No adjacent enemies, move strategically
          const { newX, newY } = moveStrategically(currentUnit, updatedUnits, cities, map, aiPlayerId);
          
          if (newX !== currentUnit.x || newY !== currentUnit.y) {
            updatedUnits[unitIndex] = {
              ...currentUnit,
              x: newX,
              y: newY,
              movesLeft: 0
            };
          }
        }
        break;
        
      case 'scout':
        // Explore unexplored areas
        const { newX, newY } = exploreMap(currentUnit, revealedTiles, map, updatedUnits);
        
        if (newX !== currentUnit.x || newY !== currentUnit.y) {
          updatedUnits[unitIndex] = {
            ...currentUnit,
            x: newX,
            y: newY,
            movesLeft: 0
          };
        }
        break;
        
      default:
        // Default movement
        const { newX, newY } = moveRandomly(currentUnit, map, updatedUnits);
        
        if (newX !== currentUnit.x || newY !== currentUnit.y) {
          updatedUnits[unitIndex] = {
            ...currentUnit,
            x: newX,
            y: newY,
            movesLeft: 0
          };
        }
    }
  }
  
  return { units: updatedUnits, combatResults, foundedCities };
};

// Check if a settler should found a city
const shouldFoundCity = (settler, cities, map) => {
  // Don't found cities too close to other cities
  const nearbyCity = cities.find(city => {
    const distance = Math.abs(city.x - settler.x) + Math.abs(city.y - settler.y);
    return distance < 5; // Minimum distance between cities
  });
  
  if (nearbyCity) return false;
  
  // Check if current location is good for a city
  const terrain = map[settler.y][settler.x];
  
  // Prefer locations with good yields
  const goodLocation = 
    terrain.food >= 1 && 
    terrain.production >= 1;
  
  // Check surrounding tiles for variety of resources
  let foodCount = 0;
  let productionCount = 0;
  
  for(let dy = -1; dy <= 1; dy++) {
    for(let dx = -1; dx <= 1; dx++) {
      const nx = settler.x + dx;
      const ny = settler.y + dy;
      
      if (nx >= 0 && ny >= 0 && nx < map[0].length && ny < map.length) {
        const nearbyTerrain = map[ny][nx];
        if (nearbyTerrain.food > 0) foodCount++;
        if (nearbyTerrain.production > 0) productionCount++;
      }
    }
  }
  
  // Found city if location has good food and production
  return goodLocation || (foodCount >= 3 && productionCount >= 2);
};

// Move settler towards good city location
const moveTowardsCityLocation = (settler, cities, map, units) => {
  // Initialize with current position
  let newX = settler.x;
  let newY = settler.y;
  
  // Score all adjacent tiles
  const tileScores = [];
  
  for(let dy = -1; dy <= 1; dy++) {
    for(let dx = -1; dx <= 1; dx++) {
      // Skip current position
      if (dx === 0 && dy === 0) continue;
      
      const nx = settler.x + dx;
      const ny = settler.y + dy;
      
      // Skip if out of bounds
      if (nx < 0 || ny < 0 || nx >= map[0].length || ny >= map.length) continue;
      
      // Skip if impassable
      if (!map[ny][nx].passable) continue;
      
      // Skip if occupied by another unit
      const unitAtPos = units.find(u => u.x === nx && u.y === ny && u !== settler);
      if (unitAtPos) continue;
      
      // Skip if too close to another city
      const nearbyCity = cities.find(city => {
        const distance = Math.abs(city.x - nx) + Math.abs(city.y - ny);
        return distance < 4;
      });
      if (nearbyCity) continue;
      
      // Score the tile based on food, production and variety of surrounding tiles
      let score = map[ny][nx].food * 2 + map[ny][nx].production * 1.5 + map[ny][nx].gold;
      
      // Consider surrounding tiles
      for(let sy = -1; sy <= 1; sy++) {
        for(let sx = -1; sx <= 1; sx++) {
          const surroundX = nx + sx;
          const surroundY = ny + sy;
          
          if (surroundX >= 0 && surroundY >= 0 && surroundX < map[0].length && surroundY < map.length) {
            const surroundTerrain = map[surroundY][surroundX];
            score += surroundTerrain.food * 0.5;
            score += surroundTerrain.production * 0.4;
            score += surroundTerrain.gold * 0.3;
          }
        }
      }
      
      tileScores.push({ x: nx, y: ny, score });
    }
  }
  
  // Move to highest scored tile if available
  if (tileScores.length > 0) {
    tileScores.sort((a, b) => b.score - a.score);
    newX = tileScores[0].x;
    newY = tileScores[0].y;
  }
  
  return { newX, newY };
};

// Find adjacent enemy unit
const findAdjacentEnemyUnit = (unit, units, aiPlayerId) => {
  for(let dy = -1; dy <= 1; dy++) {
    for(let dx = -1; dx <= 1; dx++) {
      // Skip current position and diagonals
      if ((dx === 0 && dy === 0) || (dx !== 0 && dy !== 0)) continue;
      
      const nx = unit.x + dx;
      const ny = unit.y + dy;
      
      // Find enemy unit at this position
      const enemyUnit = units.find(u => u.x === nx && u.y === ny && u.player !== aiPlayerId);
      
      if (enemyUnit) return enemyUnit;
    }
  }
  
  return null;
};

// Resolve combat between units
const resolveCombat = (attacker, defender, units) => {
  // Get unit details
  const attackerType = Object.values(UNIT_TYPES).find(t => t.name === attacker.type);
  const defenderType = Object.values(UNIT_TYPES).find(t => t.name === defender.type);
  
  // Calculate combat strength
  const attackStrength = attackerType.strength;
  const defendStrength = defenderType.strength;
  
  // Determine victor (simplified combat)
  const totalStrength = attackStrength + defendStrength;
  const attackerWinChance = attackStrength / totalStrength;
  
  const attackerWins = Math.random() < attackerWinChance;
  
  return {
    attacker,
    defender,
    victorId: attackerWins ? attacker.player : defender.player,
    loserId: attackerWins ? defender.player : attacker.player
  };
};

// Move military units strategically
const moveStrategically = (unit, units, cities, map, aiPlayerId) => {
  // Initialize with current position
  let newX = unit.x;
  let newY = unit.y;
  
  // Find enemy units to move towards
  const enemyUnits = units.filter(u => u.player !== aiPlayerId);
  let closestEnemyDist = Infinity;
  let closestEnemyUnit = null;
  
  enemyUnits.forEach(enemyUnit => {
    const dist = Math.abs(unit.x - enemyUnit.x) + Math.abs(unit.y - enemyUnit.y);
    if (dist < closestEnemyDist) {
      closestEnemyDist = dist;
      closestEnemyUnit = enemyUnit;
    }
  });
  
  // If we have cities, protect them
  const aiCities = cities.filter(city => city.player === aiPlayerId);
  let closestCityDist = Infinity;
  let closestCity = null;
  
  aiCities.forEach(city => {
    const dist = Math.abs(unit.x - city.x) + Math.abs(unit.y - city.y);
    if (dist < closestCityDist) {
      closestCityDist = dist;
      closestCity = city;
    }
  });
  
  // Decision making - protect city or attack
  const unitType = Object.values(UNIT_TYPES).find(t => t.name === unit.type);
  const movementRange = unitType.movementRange;
  
  // If enemy is close, move towards them
  if (closestEnemyUnit && closestEnemyDist < 10) {
    // Move towards enemy
    return moveTowards(unit, closestEnemyUnit.x, closestEnemyUnit.y, map, units, movementRange);
  }
  
  // Otherwise protect city if we have one
  if (closestCity) {
    // If we're far from the city, move towards it
    if (closestCityDist > 3) {
      return moveTowards(unit, closestCity.x, closestCity.y, map, units, movementRange);
    }
    
    // If we're already near the city, just patrol
    return patrolAroundPoint(unit, closestCity.x, closestCity.y, map, units, movementRange);
  }
  
  // No enemies or cities nearby, explore
  return exploreMap(unit, {}, map, units);
};

// Move towards a target position
const moveTowards = (unit, targetX, targetY, map, units, maxDist = 1) => {
  // Initialize with current position
  let newX = unit.x;
  let newY = unit.y;
  
  // Compute direction to target
  const dx = targetX > unit.x ? 1 : (targetX < unit.x ? -1 : 0);
  const dy = targetY > unit.y ? 1 : (targetY < unit.y ? -1 : 0);
  
  // Try to move in that direction
  const possibleMoves = [];
  
  // Prefer direct diagonal movement if available
  if (dx !== 0 && dy !== 0) {
    possibleMoves.push({ dx, dy });
  }
  
  // Then try cardinal directions
  if (dx !== 0) possibleMoves.push({ dx, dy: 0 });
  if (dy !== 0) possibleMoves.push({ dx: 0, dy });
  
  // Add other directions as fallbacks
  if (dx === 0 && dy === 0) {
    // If we're at the target, try all directions
    possibleMoves.push({ dx: 1, dy: 0 });
    possibleMoves.push({ dx: -1, dy: 0 });
    possibleMoves.push({ dx: 0, dy: 1 });
    possibleMoves.push({ dx: 0, dy: -1 });
  }
  
  // Try moves until we find a valid one
  for (const move of possibleMoves) {
    const nx = unit.x + move.dx;
    const ny = unit.y + move.dy;
    
    // Skip if out of bounds
    if (nx < 0 || ny < 0 || nx >= map[0].length || ny >= map.length) continue;
    
    // Skip if impassable
    if (!map[ny][nx].passable) continue;
    
    // Skip if occupied by another unit
    const unitAtPos = units.find(u => u.x === nx && u.y === ny && u !== unit);
    if (unitAtPos) continue;
    
    newX = nx;
    newY = ny;
    break;
  }
  
  return { newX, newY };
};

// Patrol around a point
const patrolAroundPoint = (unit, centerX, centerY, map, units, maxDist = 1) => {
  // Move randomly but stay close to the center
  const possibleMoves = [];
  
  for(let dy = -maxDist; dy <= maxDist; dy++) {
    for(let dx = -maxDist; dx <= maxDist; dx++) {
      if (dx === 0 && dy === 0) continue;
      
      const nx = unit.x + dx;
      const ny = unit.y + dy;
      
      // Skip if too far from center
      const distFromCenter = Math.abs(nx - centerX) + Math.abs(ny - centerY);
      if (distFromCenter > 3) continue;
      
      // Skip if out of bounds
      if (nx < 0 || ny < 0 || nx >= map[0].length || ny >= map.length) continue;
      
      // Skip if impassable
      if (!map[ny][nx].passable) continue;
      
      // Skip if occupied by another unit
      const unitAtPos = units.find(u => u.x === nx && u.y === ny && u !== unit);
      if (unitAtPos) continue;
      
      possibleMoves.push({ x: nx, y: ny });
    }
  }
  
  // If no valid moves, stay put
  if (possibleMoves.length === 0) {
    return { newX: unit.x, newY: unit.y };
  }
  
  // Choose a random valid move
  const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  return { newX: randomMove.x, newY: randomMove.y };
};

// Explore the map with scout units
const exploreMap = (unit, revealedTiles, map, units) => {
  // Movement options scoring
  const options = [];
  
  for(let dy = -1; dy <= 1; dy++) {
    for(let dx = -1; dx <= 1; dx++) {
      // Skip current position and diagonals
      if ((dx === 0 && dy === 0) || (dx !== 0 && dy !== 0)) continue;
      
      const nx = unit.x + dx;
      const ny = unit.y + dy;
      
      // Skip if out of bounds
      if (nx < 0 || ny < 0 || nx >= map[0].length || ny >= map.length) continue;
      
      // Skip if impassable
      if (!map[ny][nx].passable) continue;
      
      // Skip if occupied by another unit
      const unitAtPos = units.find(u => u.x === nx && u.y === ny && u !== unit);
      if (unitAtPos) continue;
      
      // Score based on unexplored adjacent tiles
      let score = 0;
      
      for(let sy = -1; sy <= 1; sy++) {
        for(let sx = -1; sx <= 1; sx++) {
          const exploreX = nx + sx;
          const exploreY = ny + sy;
          
          if (exploreX >= 0 && exploreY >= 0 && exploreX < map[0].length && exploreY < map.length) {
            // Higher score for unexplored tiles
            if (!revealedTiles[`${exploreX},${exploreY}`]) {
              score += 2;
            }
          }
        }
      }
      
      options.push({ x: nx, y: ny, score });
    }
  }
  
  // If no valid moves, stay put
  if (options.length === 0) {
    return { newX: unit.x, newY: unit.y };
  }
  
  // Choose the highest scoring move
  options.sort((a, b) => b.score - a.score);
  
  // If all options have zero score, pick randomly
  if (options[0].score === 0) {
    const randomOption = options[Math.floor(Math.random() * options.length)];
    return { newX: randomOption.x, newY: randomOption.y };
  }
  
  return { newX: options[0].x, newY: options[0].y };
};

// Move randomly
const moveRandomly = (unit, map, units) => {
  // Initialize with current position
  let newX = unit.x;
  let newY = unit.y;
  
  // Possible movement directions
  const directions = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 }
  ];
  
  // Shuffle directions
  directions.sort(() => 0.5 - Math.random());
  
  // Try each direction
  for (const dir of directions) {
    const nx = unit.x + dir.dx;
    const ny = unit.y + dir.dy;
    
    // Skip if out of bounds
    if (nx < 0 || ny < 0 || nx >= map[0].length || ny >= map.length) continue;
    
    // Skip if impassable
    if (!map[ny][nx].passable) continue;
    
    // Skip if occupied by another unit
    const unitAtPos = units.find(u => u.x === nx && u.y === ny && u !== unit);
    if (unitAtPos) continue;
    
    newX = nx;
    newY = ny;
    break;
  }
  
  return { newX, newY };
};