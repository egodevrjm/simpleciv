import React, { useState, useEffect } from 'react';
import './App.css';
import GameMap from './components/GameMap';
import CityView from './components/CityView';
import TechTree from './components/TechTree';
import SetupView from './components/setup/SetupView';
import { PLAYERS, UNIT_TYPES, TERRAIN_TYPES, AI_PLAYER_IDS, BUILDING_TYPES, WONDER_TYPES, TECHNOLOGIES } from './constants';

const CivilizationGame = () => {
  // City name arrays for each civilization
  const cityNamesByCiv = {
    england: [
      "London", "York", "Nottingham", "Hastings", "Canterbury", "Coventry", 
      "Warwick", "Newcastle", "Oxford", "Liverpool", "Dover", "Brighton", 
      "Norwich", "Leeds", "Reading", "Birmingham", "Richmond", "Exeter", "Cambridge", "Gloucester"
    ],
    germany: [
      "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", 
      "Essen", "Dortmund", "Düsseldorf", "Bremen", "Dresden", "Hannover", 
      "Leipzig", "Nuremberg", "Bonn", "Münster", "Karlsruhe", "Aachen", "Heidelberg", "Augsburg"
    ],
    russia: [
      "Moscow", "St. Petersburg", "Novgorod", "Kazan", "Volgograd", "Smolensk", 
      "Yekaterinburg", "Sevastopol", "Rostov-on-Don", "Novosibirsk", "Vladivostok", "Nizhny Novgorod", 
      "Omsk", "Samara", "Tomsk", "Chelyabinsk", "Ufa", "Voronezh", "Sochi", "Magnitogorsk"
    ],
    america: [
      "Washington", "New York", "Boston", "Philadelphia", "Atlanta", "Chicago", 
      "Seattle", "San Francisco", "Los Angeles", "Houston", "Portland", "Miami", 
      "Dallas", "Detroit", "Denver", "New Orleans", "Baltimore", "St. Louis", "Cincinnati", "Cleveland"
    ],
    china: [
      "Beijing", "Shanghai", "Guangzhou", "Nanjing", "Xian", "Chengdu", 
      "Hangzhou", "Tianjin", "Macau", "Chongqing", "Shenzhen", "Suzhou", 
      "Qingdao", "Wuhan", "Ningbo", "Shenyang", "Dalian", "Changsha", "Xiamen", "Kunming"
    ],
    egypt: [
      "Cairo", "Alexandria", "Thebes", "Memphis", "Giza", "Luxor", 
      "Heliopolis", "Abydos", "Aswan", "Edfu", "Buto", "Akhetaten", 
      "Avaris", "Hermopolis", "Herakleopolis", "Tinis", "El-Minya", "Dendera", "Sais", "Tanis"
    ],
    france: [
      "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", 
      "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", 
      "Le Havre", "Toulon", "Grenoble", "Dijon", "Angers", "Brest", "Amiens", "Tours"
    ],
    japan: [
      "Kyoto", "Osaka", "Tokyo", "Satsuma", "Kagoshima", "Nara", 
      "Nagoya", "Izumo", "Nagasaki", "Yokohama", "Shimonoseki", "Matsuyama", 
      "Sapporo", "Hakodate", "Fukuoka", "Kobe", "Sendai", "Hiroshima", "Kawasaki", "Yokosuka"
    ],
    greece: [
      "Athens", "Sparta", "Corinth", "Thebes", "Rhodes", "Argos", 
      "Knossos", "Delphi", "Mycenae", "Olympia", "Syracuse", "Miletus", 
      "Epidaurus", "Megara", "Messene", "Pyrrhus", "Eretria", "Chalcis", "Troy", "Mantinea"
    ],
    rome: [
      "Rome", "Antium", "Ravenna", "Neapolis", "Tarentum", "Mediolanum", 
      "Pompeii", "Pisae", "Arretium", "Verona", "Caesaraugusta", "Augusta Taurinorum", 
      "Aquileia", "Florentia", "Ariminum", "Caesarea", "Croton", "Syracusae", "Paestum", "Bononia"
    ],
    aztec: [
      "Tenochtitlan", "Teotihuacan", "Tlacopan", "Cholula", "Tlatelolco", "Texcoco", 
      "Iztapalapa", "Azcapotzalco", "Xochimilco", "Calixtlahuaca", "Cuernavaca", "Huexotla", 
      "Cempoala", "Tepetlaoxtoc", "Tlamanalco", "Tenango", "Otumba", "Tula", "Chalco", "Coatepec"
    ],
    india: [
      "Delhi", "Mumbai", "Kolkata", "Varanasi", "Agra", "Bangalore", 
      "Pataliputra", "Madras", "Hyderabad", "Ahmadabad", "Surat", "Vijayanagara", 
      "Lahore", "Jaipur", "Mysore", "Thanjavur", "Ujjain", "Jaunpur", "Fatehpur Sikri", "Indraprastha"
    ]
  };
  
  // Generic city names (fallback)
  const cityNames = [
    "Alexandria", "Rome", "Athens", "Sparta", "Babylon", "Memphis", "Carthage", "Troy", 
    "Persepolis", "Thebes", "Constantinople", "Nineveh", "Tyre", "Antioch", "Syracuse",
    "London", "Paris", "Berlin", "Vienna", "Moscow", "Madrid", "Lisbon", "Amsterdam",
    "Brussels", "Copenhagen", "Stockholm", "Oslo", "Dublin", "Prague", "Budapest"
  ];
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [map, setMap] = useState([]);
  const [units, setUnits] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(PLAYERS.HUMAN.id);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [revealedTiles, setRevealedTiles] = useState({});
  const [turnNumber, setTurnNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [gameNotification, setGameNotification] = useState(null);
  
  // New game systems
  const [gold, setGold] = useState(100);
  const [science, setScience] = useState(0);
  const [researchedTechs, setResearchedTechs] = useState(['Agriculture']);
  const [currentResearch, setCurrentResearch] = useState(null);
  const [researchProgress, setResearchProgress] = useState(0);
  const [showCityView, setShowCityView] = useState(false);
  const [showTechTree, setShowTechTree] = useState(false);

  useEffect(() => {
    if (gameStarted && currentPlayer !== PLAYERS.HUMAN.id) {
      // Simulate AI turn (replace with actual AI logic)
      setTimeout(() => {
        // Only auto-advance AI turns, not human turns
        const nextPlayer = getNextPlayer(currentPlayer);
        processAiTurn(currentPlayer);
        setCurrentPlayer(nextPlayer);
      }, 1000);
    }
  }, [currentPlayer, gameStarted]);
  
  // Helper function to get the next player
  const getNextPlayer = (player) => {
    const playerIds = Object.values(PLAYERS).map(p => p.id);
    const currentIndex = playerIds.indexOf(player);
    const nextIndex = (currentIndex + 1) % playerIds.length;
    return playerIds[nextIndex];
  };
  
  // Process AI turn (simplified)
  const processAiTurn = (aiPlayer) => {
    // Here we would call the AI logic from aiLogic.js
    // We no longer update the turn number here since that should only happen when the human player ends their turn
  };

  const startNewGame = (setupData) => {
    const newMap = generateMap(setupData.mapSize);
    const initialUnits = initializeUnits(newMap, setupData);
    const initialRevealedTiles = initializeRevealedTiles(newMap, initialUnits);

    setMap(newMap);
    setUnits(initialUnits);
    setCities([]);
    setCurrentPlayer(PLAYERS.HUMAN.id);
    setTurnNumber(1);
    setGameStarted(true);
    setSelectedCity(null);
    setSelectedUnit(null);
    setGameOver(false);
    setIsVictory(false);
    setGameNotification({
      message: "Welcome to SimpleCiv! Start by exploring and founding your first city.",
      type: 'info'
    });
    setRevealedTiles(initialRevealedTiles);
    
    // Initialize new game systems
    setGold(100);
    setScience(0);
    setResearchedTechs(['Agriculture']);
    setCurrentResearch(null);
    setResearchProgress(0);
    setShowCityView(false);
    setShowTechTree(false);
  };

  const generateMap = (mapSize) => {
    // Initialize empty map
    const map = Array(mapSize).fill().map(() => Array(mapSize).fill(null));
    
    // Generate heightmap using simple noise-like algorithm
    const heightMap = Array(mapSize).fill().map(() => Array(mapSize).fill(0));
    
    // Add some random mountains
    const mountainCount = Math.floor(mapSize * mapSize * 0.03); // 3% of the map
    for (let i = 0; i < mountainCount; i++) {
      const x = Math.floor(Math.random() * mapSize);
      const y = Math.floor(Math.random() * mapSize);
      heightMap[y][x] = 1;
      
      // Add some neighboring mountains to create ranges
      for (let j = 0; j < 3; j++) { // Each mountain can spawn up to 3 neighbors
        const dx = Math.floor(Math.random() * 3) - 1;
        const dy = Math.floor(Math.random() * 3) - 1;
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && ny >= 0 && nx < mapSize && ny < mapSize && Math.random() > 0.3) {
          heightMap[ny][nx] = 1;
        }
      }
    }
    
    // Generate water bodies
    const waterMap = Array(mapSize).fill().map(() => Array(mapSize).fill(0));
    const waterSources = Math.floor(mapSize * 0.1); // 10% of map size as water sources
    
    for (let i = 0; i < waterSources; i++) {
      const x = Math.floor(Math.random() * mapSize);
      const y = Math.floor(Math.random() * mapSize);
      waterMap[y][x] = 1;
      
      // Expand water
      let waterCells = [{x, y}];
      const waterSize = Math.floor(Math.random() * 10) + 5; // Random sized lakes
      
      for (let j = 0; j < waterSize; j++) {
        if (waterCells.length === 0) break;
        
        const randomIndex = Math.floor(Math.random() * waterCells.length);
        const cell = waterCells[randomIndex];
        
        const directions = [
          {dx: 1, dy: 0},
          {dx: -1, dy: 0},
          {dx: 0, dy: 1},
          {dx: 0, dy: -1}
        ];
        
        for (const dir of directions) {
          const nx = cell.x + dir.dx;
          const ny = cell.y + dir.dy;
          
          if (nx >= 0 && ny >= 0 && nx < mapSize && ny < mapSize && waterMap[ny][nx] === 0 && Math.random() > 0.3) {
            waterMap[ny][nx] = 1;
            waterCells.push({x: nx, y: ny});
          }
        }
        
        // Remove processed cell
        waterCells.splice(randomIndex, 1);
      }
    }
    
    // Additional climate factors (north = colder, south = warmer)
    const climateMap = Array(mapSize).fill().map((_, y) => {
      return Array(mapSize).fill().map(() => {
        // Climate factor from 0 (cold) to 1 (hot) based on y-coordinate
        return 1 - (y / mapSize);
      });
    });
    
    // Convert these factors into actual terrain
    for (let y = 0; y < mapSize; y++) {
      for (let x = 0; x < mapSize; x++) {
        if (waterMap[y][x] === 1) {
          map[y][x] = TERRAIN_TYPES.WATER;
        } else if (heightMap[y][x] === 1) {
          map[y][x] = TERRAIN_TYPES.MOUNTAIN;
        } else {
          const climate = climateMap[y][x];
          let terrain;
          
          if (climate < 0.2) { // Very cold (north)
            terrain = Math.random() > 0.7 ? TERRAIN_TYPES.SNOW : TERRAIN_TYPES.TUNDRA;
          } else if (climate < 0.4) { // Cold
            terrain = Math.random() > 0.5 ? TERRAIN_TYPES.TUNDRA : TERRAIN_TYPES.PLAINS;
          } else if (climate < 0.7) { // Temperate
            if (Math.random() > 0.6) {
              terrain = TERRAIN_TYPES.FOREST;
            } else if (Math.random() > 0.5) {
              terrain = TERRAIN_TYPES.HILLS;
            } else {
              terrain = TERRAIN_TYPES.GRASSLAND;
            }
          } else { // Warm/hot (south)
            if (Math.random() > 0.7) {
              terrain = TERRAIN_TYPES.JUNGLE;
            } else if (Math.random() > 0.5) {
              terrain = TERRAIN_TYPES.DESERT;
            } else {
              terrain = TERRAIN_TYPES.PLAINS;
            }
          }
          
          map[y][x] = terrain;
        }
      }
    }
    
    return map;
  };

  const initializeUnits = (map, setupData) => {
    const units = [];
    const players = [PLAYERS.HUMAN, ...AI_PLAYER_IDS.map(id => ({ id }))];
    
    players.forEach(player => {
      // Find a suitable starting location
      let startX, startY;
      let locationFound = false;
      
      while (!locationFound) {
        startX = Math.floor(Math.random() * setupData.mapSize);
        startY = Math.floor(Math.random() * setupData.mapSize);
        
        if (map[startY][startX].passable) {
          locationFound = true;
        }
      }
      
      // Add a settler for each player
      units.push({ 
        x: startX, 
        y: startY, 
        type: UNIT_TYPES.SETTLER.name, 
        player: player.id, 
        movesLeft: UNIT_TYPES.SETTLER.movementRange,
        strength: UNIT_TYPES.SETTLER.strength
      });
      
      // Add a warrior unit for the human player only
      if (player.id === PLAYERS.HUMAN.id) {
        // Find an adjacent tile for the warrior
        const directions = [
          {dx: 1, dy: 0},
          {dx: -1, dy: 0},
          {dx: 0, dy: 1},
          {dx: 0, dy: -1}
        ];
        
        let warriorX = startX;
        let warriorY = startY;
        
        // Try to place warrior on an adjacent tile
        for (const dir of directions) {
          const nx = startX + dir.dx;
          const ny = startY + dir.dy;
          
          if (nx >= 0 && ny >= 0 && nx < map[0].length && ny < map.length && map[ny][nx].passable) {
            warriorX = nx;
            warriorY = ny;
            break;
          }
        }
        
        units.push({ 
          x: warriorX, 
          y: warriorY, 
          type: UNIT_TYPES.WARRIOR.name, 
          player: player.id, 
          movesLeft: UNIT_TYPES.WARRIOR.movementRange,
          strength: UNIT_TYPES.WARRIOR.strength
        });
        
        console.log(`Initialized human player with Settler at (${startX},${startY}) and Warrior at (${warriorX},${warriorY})`);
      } else {
        console.log(`Initialized AI player ${player.id} with Settler at (${startX},${startY})`);
      }
    });
    
    return units;
  };

  const initializeRevealedTiles = (map, units) => {
    const revealedTiles = {};
    units.forEach(unit => {
      // Reveal the unit tile and surrounding tiles in a 3x3 area
      for(let dy = -2; dy <= 2; dy++) {
        for(let dx = -2; dx <= 2; dx++) {
          const nx = unit.x + dx;
          const ny = unit.y + dy;
          if (nx >= 0 && ny >= 0 && nx < map[0].length && ny < map.length) {
            revealedTiles[`${nx},${ny}`] = true;
          }
        }
      }
    });
    return revealedTiles;
  };

  const handleTileClick = (x, y) => {
    const clickedUnit = units.find(unit => unit.x === x && unit.y === y);
    const clickedCity = cities.find(city => city.x === x && city.y === y);

    if (selectedUnit && !clickedUnit && !clickedCity) {
      // If a unit is selected and clicking on an empty tile, try to move
      moveUnit(selectedUnit, x, y);
    } else if (clickedUnit && clickedUnit.player === currentPlayer) {
      // If clicking on own unit, select it
      setSelectedUnit(clickedUnit);
      setSelectedCity(null);
      
      // Show game notification
      setGameNotification({
        message: `Selected ${clickedUnit.type}`,
        type: 'info'
      });
    } else if (clickedUnit && clickedUnit.player !== currentPlayer) {
      // If clicking on enemy unit
      setGameNotification({
        message: `Enemy ${clickedUnit.type} spotted`,
        type: 'info'
      });
    } else if (clickedCity) {
      setSelectedCity(clickedCity);
      setSelectedUnit(null);
      
      const cityOwner = clickedCity.player === currentPlayer ? "Your" : "Enemy";
      setGameNotification({
        message: `${cityOwner} city: ${clickedCity.name}`,
        type: 'info'
      });
      
      // If it's the player's city, open city view
      if (clickedCity.player === PLAYERS.HUMAN.id) {
        setShowCityView(true);
      }
    } else {
      setSelectedUnit(null);
      setSelectedCity(null);
      
      // Get terrain type at clicked location if revealed
      if (revealedTiles[`${x},${y}`]) {
        const terrain = map[y][x];
        setGameNotification({
          message: `${terrain.name.charAt(0).toUpperCase() + terrain.name.slice(1)} terrain`,
          type: 'info'
        });
      }
    }
  };

  const moveUnit = (unit, x, y) => {
    // Check if the selected unit belongs to the current player
    if (unit.player !== currentPlayer) {
      setGameNotification({
        message: "You can only move your own units.",
        type: 'error'
      });
      return;
    }
    
    // Check if the unit has movement points left
    if (unit.movesLeft <= 0) {
      setGameNotification({
        message: "This unit has no movement points left this turn.",
        type: 'error'
      });
      return;
    }
    
    // Check if destination is passable
    if (!map[y][x].passable) {
      setGameNotification({
        message: `Can't move to ${map[y][x].name}. This terrain is impassable.`,
        type: 'error'
      });
      return;
    }
    
    // Check if there's already a unit at the destination
    const unitAtDestination = units.find(u => u.x === x && u.y === y);
    if (unitAtDestination) {
      // If the unit at destination is not owned by the current player, implement attack logic here
      if (unitAtDestination.player !== currentPlayer) {
        setGameNotification({
          message: "Combat is not implemented yet.",
          type: 'info'
        });
        return;
      } else {
        setGameNotification({
          message: "There's already one of your units at this location.",
          type: 'error'
        });
        return;
      }
    }
    
    // Calculate movement using Manhattan distance
    const distance = Math.abs(unit.x - x) + Math.abs(unit.y - y);
    const unitType = Object.values(UNIT_TYPES).find(type => type.name === unit.type);
    
    if (distance <= unitType.movementRange) {
      // Move the unit
      setUnits(prevUnits => prevUnits.map(u =>
        u === unit ? { ...u, x, y, movesLeft: 0 } : u
      ));
      
      // Reveal tiles around the unit's new position
      const newRevealedTiles = {...revealedTiles};
      for(let dy = -1; dy <= 1; dy++) {
        for(let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < map[0].length && ny < map.length) {
            newRevealedTiles[`${nx},${ny}`] = true;
          }
        }
      }
      setRevealedTiles(newRevealedTiles);
      
      // Deselect the unit
      setSelectedUnit(null);
      
      setGameNotification({
        message: `${unitType.name.charAt(0).toUpperCase() + unitType.name.slice(1)} moved to (${x},${y})`,
        type: 'info'
      });
    } else {
      setGameNotification({
        message: `That location is too far. This unit can only move ${unitType.movementRange} tiles per turn.`,
        type: 'error'
      });
    }
  };

  const foundCity = (settler) => {
    // Check if there's already a city at this location
    const existingCity = cities.find(city => city.x === settler.x && city.y === settler.y);
    if (existingCity) {
      setGameNotification({
        message: "There's already a city at this location.",
        type: 'error'
      });
      return;
    }
    
    // Generate a city name based on player ID and existing cities
    const playerCities = cities.filter(city => city.player === settler.player);
    let cityName = '';
    
    if (playerCities.length < cityNames.length) {
      // Use a predefined name if available
      const usedNames = playerCities.map(city => city.name);
      cityName = cityNames.find(name => !usedNames.includes(name)) || `City ${playerCities.length + 1}`;
    } else {
      // Fallback to generic city name
      cityName = `City ${playerCities.length + 1}`;
    }
    
    // Calculate yields based on surrounding tiles
    const surroundingTiles = [];
    for(let dy = -1; dy <= 1; dy++) {
      for(let dx = -1; dx <= 1; dx++) {
        const nx = settler.x + dx;
        const ny = settler.y + dy;
        if (nx >= 0 && ny >= 0 && nx < map[0].length && ny < map.length) {
          surroundingTiles.push(map[ny][nx]);
        }
      }
    }
    
    const baseFood = surroundingTiles.reduce((sum, tile) => sum + tile.food, 0);
    const baseProduction = surroundingTiles.reduce((sum, tile) => sum + tile.production, 0);
    const baseGold = surroundingTiles.reduce((sum, tile) => sum + tile.gold, 0);
    
    // Create the new city with improved properties
    const newCity = {
      x: settler.x,
      y: settler.y,
      name: cityName,
      player: settler.player,
      population: 1,
      food: 0,
      foodPerTurn: baseFood,
      foodNeeded: 10, // Food needed for next population point
      production: 0,
      productionPerTurn: baseProduction,
      gold: 0,
      goldPerTurn: baseGold,
      science: 0,
      sciencePerTurn: 1, // Base science production
      buildings: [],
      currentProduction: null,
      productionQueue: [],
      workedTiles: [`${settler.x},${settler.y}`],
      health: 20,
      maxHealth: 20,
      defense: 5
    };
    
    // Add the city to the game state
    setCities([...cities, newCity]);
    
    // Remove the settler unit
    setUnits(units.filter(unit => unit !== settler));
    
    // Deselect the unit
    setSelectedUnit(null);
    
    // Notify the player
    setGameNotification({
      message: `Founded new city: ${cityName}!`,
      type: 'success'
    });
    
    // Reveal tiles around the city
    const newRevealedTiles = {...revealedTiles};
    for(let dy = -3; dy <= 3; dy++) {
      for(let dx = -3; dx <= 3; dx++) {
        const nx = settler.x + dx;
        const ny = settler.y + dy;
        if (nx >= 0 && ny >= 0 && nx < map[0].length && ny < map.length) {
          newRevealedTiles[`${nx},${ny}`] = true;
        }
      }
    }
    setRevealedTiles(newRevealedTiles);
    
    // If this is the human player's first city, open the city view
    if (settler.player === PLAYERS.HUMAN.id && playerCities.length === 0) {
      setTimeout(() => {
        setSelectedCity(newCity);
        setShowCityView(true);
      }, 500);
    }
  };
  
  const setProduction = (city, type, id) => {
    // Set production for a city
    console.log('Setting production:', city.name, type, id); // Debug log
    const productionItem = { type, id };
    
    // Make a deep copy of cities to ensure state updates properly
    const updatedCities = cities.map(c => {
      if (c.x === city.x && c.y === city.y) {
        return {
          ...c,
          currentProduction: productionItem,
          productionQueue: c.productionQueue ? [...c.productionQueue] : []
        };
      }
      return c;
    });
    
    // Important: Update the state
    setCities(updatedCities);
    
    // Update the selected city if it's the one being modified
    if (selectedCity && selectedCity.x === city.x && selectedCity.y === city.y) {
      setSelectedCity({
        ...selectedCity,
        currentProduction: productionItem
      });
    }
    
    // Show notification
    setGameNotification({
      message: `${city.name} is now producing ${id}`,
      type: 'success'
    });
  };
  
  const queueProduction = (city, type, id) => {
    // Add an item to the city's production queue
    const productionItem = { type, id };
    
    setCities(cities.map(c => {
      if (c.x === city.x && c.y === city.y) {
        const newQueue = [...c.productionQueue, productionItem];
        return {
          ...c,
          productionQueue: newQueue,
          // If no current production, set this as current
          currentProduction: c.currentProduction || productionItem
        };
      }
      return c;
    }));
    
    setGameNotification({
      message: `Added ${id} to ${city.name}'s production queue`,
      type: 'info'
    });
  };
  
  const setResearch = (techName) => {
    // Validate tech is available for research
    const tech = Object.values(TECHNOLOGIES).find(t => t.name === techName);
    
    // Check if tech is already researched
    if (researchedTechs.includes(techName)) {
      setGameNotification({
        message: `${techName} has already been researched`,
        type: 'error'
      });
      return;
    }
    
    // Check prerequisites
    const prereqsMet = tech.prereqs.every(prereq => researchedTechs.includes(prereq));
    if (!prereqsMet) {
      setGameNotification({
        message: `You need to research ${tech.prereqs.join(', ')} first`,
        type: 'error'
      });
      return;
    }
    
    // Set current research
    setCurrentResearch(techName);
    setResearchProgress(0);
    
    setGameNotification({
      message: `Now researching: ${techName}`,
      type: 'info'
    });
  };
  
  const openCityView = () => {
    if (selectedCity && selectedCity.player === PLAYERS.HUMAN.id) {
      setShowCityView(true);
    } else {
      setGameNotification({
        message: 'Select one of your cities first',
        type: 'error'
      });
    }
  };
  
  const openTechTree = () => {
    // Check if player has any cities before allowing research
    const playerCities = cities.filter(city => city.player === PLAYERS.HUMAN.id);
    
    if (playerCities.length === 0) {
      setGameNotification({
        message: 'You need to found a city before you can begin research',
        type: 'error'
      });
      return;
    }
    
    setShowTechTree(true);
  };
  
  const handleCityViewClose = () => {
    setShowCityView(false);
  };
  
  const handleTechTreeClose = () => {
    setShowTechTree(false);
  };

  const endTurn = () => {
    // Only process turn end if it's the human player
    if (currentPlayer !== PLAYERS.HUMAN.id) {
      console.warn('Tried to end turn when it is not the human player\'s turn');
      return;
    }
    
    // Process the human player's end of turn stuff
    processHumanEndTurn();
    
    // Get next player
    const nextPlayer = getNextPlayer(currentPlayer);
    
    // Reset unit movement points for the next player
    setUnits(prevUnits => prevUnits.map(unit => {
    if (unit.player === nextPlayer) {
    const unitType = Object.values(UNIT_TYPES).find(type => type.name === unit.type);
    return {
    ...unit,
    movesLeft: unitType.movementRange
    };
    }
    return unit;
    }));
    
    // Advance to next player
    setCurrentPlayer(nextPlayer);
    
    // Reset notifications
    setGameNotification(null);
  };
  
  // Process end of human player's turn
  const processHumanEndTurn = () => {
    // Increment turn number (only when we've gone through all players)
    setTurnNumber(turnNumber + 1);
    
    // Initialize variables to track state updates
    let newUnitsCreated = []; // Track newly created units
    
    // Update city production and growth
    let goldIncome = 0;
    let scienceIncome = 0;
    let updatedCities = [];
    let completedProduction = [];
    let populationGrowth = [];
    
    const playerCities = cities.filter(city => city.player === PLAYERS.HUMAN.id);
    
    playerCities.forEach(city => {
      let updatedCity = { ...city };
      
      // Add food and check for population growth
      updatedCity.food += updatedCity.foodPerTurn;
      if (updatedCity.food >= updatedCity.foodNeeded) {
        updatedCity.population += 1;
        updatedCity.food = 0;
        updatedCity.foodNeeded = 10 + (updatedCity.population * 5); // Increasing food requirement
        updatedCity.sciencePerTurn += 1; // More population = more science
        populationGrowth.push(updatedCity.name);
      }
      
      // Add gold
      updatedCity.gold += updatedCity.goldPerTurn;
      goldIncome += updatedCity.goldPerTurn;
      
      // Add science
      updatedCity.science += updatedCity.sciencePerTurn;
      scienceIncome += updatedCity.sciencePerTurn;
      
      // Process production
      if (updatedCity.currentProduction) {
        updatedCity.production += updatedCity.productionPerTurn;
        
        // Check if production is complete
        const productionItem = updatedCity.currentProduction;
        let productionCost = 0;
        
        if (productionItem.type === 'unit') {
        const unitType = Object.values(UNIT_TYPES).find(u => u.name === productionItem.id);
        if (unitType) {
            productionCost = unitType.productionCost;
              console.log(`Production progress for ${productionItem.id}: ${updatedCity.production}/${productionCost}`);
            } else {
              console.warn(`Unknown unit type: ${productionItem.id}`);
            }
          } else if (productionItem.type === 'building') {
          const buildingType = Object.values(BUILDING_TYPES).find(b => b.name === productionItem.id);
          productionCost = buildingType.productionCost;
        } else if (productionItem.type === 'wonder') {
          const wonderType = Object.values(WONDER_TYPES).find(w => w.name === productionItem.id);
          productionCost = wonderType.productionCost;
        }
        
        if (updatedCity.production >= productionCost) {
          // Production is complete
          if (productionItem.type === 'unit') {
            // Get unit type details
            const unitTypeDetails = Object.values(UNIT_TYPES).find(u => u.name === productionItem.id);
            
            if (unitTypeDetails) {
              // Create the new unit with correct properties
              const newUnit = {
                x: updatedCity.x,
                y: updatedCity.y,
                type: productionItem.id,
                player: PLAYERS.HUMAN.id,
                movesLeft: unitTypeDetails.movementRange,
                strength: unitTypeDetails.strength
              };
              
              // Add the new unit to our tracking array
              newUnitsCreated.push(newUnit);
                
              // Force immediate update of units to ensure render
              setUnits(prevUnits => [...prevUnits, newUnit]);
              
              console.log(`New ${unitTypeDetails.name} unit created at (${updatedCity.x},${updatedCity.y})`);
            } else {
              console.error(`Invalid unit type: ${productionItem.id}`);
            }
          } else if (productionItem.type === 'building') {
            // Add the building to the city
            updatedCity.buildings.push(productionItem.id);
            
            // Apply building effects
            const buildingType = Object.values(BUILDING_TYPES).find(b => b.name === productionItem.id);
            if (buildingType.foodBonus) updatedCity.foodPerTurn += buildingType.foodBonus;
            if (buildingType.productionBonus) updatedCity.productionPerTurn += buildingType.productionBonus;
            if (buildingType.goldBonus) updatedCity.goldPerTurn += buildingType.goldBonus;
            if (buildingType.scienceBonus) updatedCity.sciencePerTurn += buildingType.scienceBonus;
          }
          
          // Reset production and start next queue item if available
          updatedCity.production = 0;
          completedProduction.push({
            city: updatedCity.name,
            item: productionItem.id
          });
          
          if (updatedCity.productionQueue.length > 0) {
            updatedCity.currentProduction = updatedCity.productionQueue.shift();
          } else {
            updatedCity.currentProduction = null;
          }
        }
      }
      
      updatedCities.push(updatedCity);
    });
    
    // We now update units immediately when created, so this block is no longer needed
    // Debug info only
    if (newUnitsCreated.length > 0) {
      console.log(`Created ${newUnitsCreated.length} new units this turn`);
    }
    
    setCities(cities.map(city => {
      const updatedCity = updatedCities.find(c => c.x === city.x && c.y === city.y);
      return updatedCity || city;
    }));
    
    // Update player gold
    setGold(prevGold => prevGold + goldIncome);
    
    // Update research progress
    if (currentResearch) {
      const tech = Object.values(TECHNOLOGIES).find(t => t.name === currentResearch);
      const newProgress = researchProgress + scienceIncome;
      
      if (newProgress >= tech.cost) {
        // Research complete
        setResearchedTechs(prevTechs => [...prevTechs, currentResearch]);
        setCurrentResearch(null);
        setResearchProgress(0);
        setGameNotification({
          message: `Research complete: ${tech.name}`,
          type: 'success'
        });
      } else {
        setResearchProgress(newProgress);
      }
    }
    
    // Report important events
    if (completedProduction.length > 0) {
      setTimeout(() => {
        setGameNotification({
          message: `Production complete: ${completedProduction.map(p => `${p.item} in ${p.city}`).join(', ')}`,
          type: 'success'
        });
      }, 500);
    }
    
    if (populationGrowth.length > 0) {
      setTimeout(() => {
        setGameNotification({
          message: `Population increased in: ${populationGrowth.join(', ')}`,
          type: 'success'
        });
      }, 1000);
    }
  };

  if (!gameStarted) {
    return <SetupView onStartGame={startNewGame} />;
  }

  return (
    <div className="civilization-game">
      <div className="game-header">
        <div className="game-info">
          <div className="turn-info">Turn: {turnNumber}</div>
          <div className="player-info">Current Player: {currentPlayer === PLAYERS.HUMAN.id ? 'You' : currentPlayer}</div>
          <div className="resource-info">
            <span className="gold-info">🪙 Gold: {gold}</span>
            <span className="science-info">🧪 Science: {researchProgress}/{currentResearch ? Object.values(TECHNOLOGIES).find(t => t.name === currentResearch).cost : '—'}</span>
          </div>
        </div>
        <div className="action-buttons">
          <button 
            className={`action-btn ${cities.filter(city => city.player === PLAYERS.HUMAN.id).length === 0 ? 'disabled' : ''}`} 
            onClick={openTechTree}
          >
            Research
          </button>
          {selectedCity && <button className="action-btn" onClick={openCityView}>Manage City</button>}
        </div>
        {gameNotification && (
          <div className={`game-notification ${gameNotification.type}`}>
            {gameNotification.message}
          </div>
        )}
        <button className="end-turn-btn" onClick={endTurn}>End Turn</button>
      </div>
      <div className="game-container">
        <div className="game-sidebar">
          {selectedUnit && (
            <div className="unit-info-panel">
              <h3>Selected Unit</h3>
              <p>Type: {selectedUnit.type}</p>
              <p>Owner: {selectedUnit.player === PLAYERS.HUMAN.id ? 'You' : selectedUnit.player}</p>
              <p>Moves: {selectedUnit.movesLeft}/{Object.values(UNIT_TYPES).find(type => type.name === selectedUnit.type).movementRange}</p>
              {selectedUnit.type === UNIT_TYPES.SETTLER.name && selectedUnit.player === PLAYERS.HUMAN.id && (
                <button 
                  className="action-btn found-city-btn" 
                  onClick={() => foundCity(selectedUnit)}
                >
                  Found City
                </button>
              )}
            </div>
          )}
          {selectedCity && (
            <div className="city-info-panel">
              <h3>{selectedCity.name}</h3>
              <p>Owner: {selectedCity.player === PLAYERS.HUMAN.id ? 'You' : selectedCity.player}</p>
              <p>Population: {selectedCity.population}</p>
              <p>Food: {selectedCity.food}/{selectedCity.foodNeeded} (+{selectedCity.foodPerTurn}/turn)</p>
              <p>Production: {selectedCity.production} (+{selectedCity.productionPerTurn}/turn)</p>
              {selectedCity.currentProduction ? (
                <p>Producing: {selectedCity.currentProduction.id}</p>
              ) : (
                <p>No production</p>
              )}
              {selectedCity.player === PLAYERS.HUMAN.id && (
                <button 
                  className="action-btn manage-city-btn" 
                  onClick={openCityView}
                >
                  Manage City
                </button>
              )}
            </div>
          )}
          {!selectedUnit && !selectedCity && (
            <div className="help-panel">
              <h3>SimpleCiv</h3>
              <p>Click on a unit to select it.</p>
              <p>Click on an empty tile to move the selected unit.</p>
              <p>Use settlers to found new cities.</p>
              <p>Research technologies to unlock new units and buildings.</p>
              <p>Build your empire!</p>
            </div>
          )}
          
          {/* Technology Summary */}
          <div className="tech-summary-panel">
            <h3>Technology</h3>
            {currentResearch ? (
              <div>
                <p>Researching: {currentResearch}</p>
                <div className="tech-progress-container">
                  <div 
                    className="tech-progress-bar"
                    style={{ 
                      width: `${(researchProgress / Object.values(TECHNOLOGIES).find(t => t.name === currentResearch).cost) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="tech-progress-label">
                  {researchProgress}/{Object.values(TECHNOLOGIES).find(t => t.name === currentResearch).cost}
                </p>
              </div>
            ) : (
              <div>
                <p>No current research</p>
                <button 
                  className="action-btn tech-tree-btn" 
                  onClick={openTechTree}
                >
                  Open Tech Tree
                </button>
              </div>
            )}
          </div>
        </div>
        <GameMap
          map={map}
          units={units}
          cities={cities}
          selectedUnit={selectedUnit}
          selectedCity={selectedCity}
          revealedTiles={revealedTiles}
          onTileClick={handleTileClick}
        />
      </div>
      
      {/* Modals */}
      {showCityView && selectedCity && (
        <CityView 
          city={selectedCity}
          researchedTechs={researchedTechs}
          onSetProduction={(city, type, id) => setProduction(city, type, id)}
          onQueueProduction={(city, type, id) => queueProduction(city, type, id)}
          onClose={handleCityViewClose}
        />
      )}
      
      {showTechTree && (
        <TechTree
          researchedTechs={researchedTechs}
          currentResearch={currentResearch}
          researchProgress={researchProgress}
          onSetResearch={setResearch}
          onClose={handleTechTreeClose}
        />
      )}
    </div>
  );
};

export default CivilizationGame;