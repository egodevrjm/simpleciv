export const PLAYERS = {
  HUMAN: { id: 'human', name: 'Human', color: '#4CAF50' },
  AI_1: { id: 'ai_1', name: 'AI 1', color: '#FF5722' },
  AI_2: { id: 'ai_2', name: 'AI 2', color: '#FFC107' },
  AI_3: { id: 'ai_3', name: 'AI 3', color: '#03A9F4' },
};

export const UNIT_TYPES = {
  SETTLER: { name: 'settler', strength: 0, movementRange: 2, productionCost: 30, description: 'Can found new cities' },
  WARRIOR: { name: 'warrior', strength: 10, movementRange: 2, productionCost: 20, description: 'Basic combat unit' },
  ARCHER: { name: 'archer', strength: 6, movementRange: 2, productionCost: 25, description: 'Ranged combat unit' },
  SCOUT: { name: 'scout', strength: 2, movementRange: 3, productionCost: 15, description: 'Fast exploration unit' },
};

export const TERRAIN_TYPES = {
  GRASSLAND: { name: 'grassland', color: '#4d8c57', passable: true, food: 2, production: 1, gold: 0 },
  PLAINS: { name: 'plains', color: '#c2b280', passable: true, food: 1, production: 1, gold: 1 },
  FOREST: { name: 'forest', color: '#2d6a32', passable: true, food: 1, production: 2, gold: 0 },
  JUNGLE: { name: 'jungle', color: '#1e5631', passable: true, food: 2, production: 0, gold: 0 },
  HILLS: { name: 'hills', color: '#a67f53', passable: true, food: 0, production: 2, gold: 0 },
  MOUNTAIN: { name: 'mountain', color: '#8c8c8c', passable: false, food: 0, production: 0, gold: 0 },
  DESERT: { name: 'desert', color: '#e8c67d', passable: true, food: 0, production: 0, gold: 1 },
  TUNDRA: { name: 'tundra', color: '#aab9bd', passable: true, food: 1, production: 0, gold: 0 },
  SNOW: { name: 'snow', color: '#e8e8e8', passable: true, food: 0, production: 0, gold: 0 },
  WATER: { name: 'water', color: '#3d85c6', passable: false, food: 0, production: 0, gold: 0 },
};

export const BUILDING_TYPES = {
  GRANARY: { name: 'Granary', productionCost: 40, maintenanceCost: 1, foodBonus: 2, requiredTech: 'Pottery', description: 'Increases food production' },
  LIBRARY: { name: 'Library', productionCost: 60, maintenanceCost: 1, scienceBonus: 2, requiredTech: 'Writing', description: 'Increases science output' },
  BARRACKS: { name: 'Barracks', productionCost: 50, maintenanceCost: 1, militaryBonus: true, requiredTech: 'Bronze Working', description: 'Units start with +1 experience' },
  MARKET: { name: 'Market', productionCost: 80, maintenanceCost: 1, goldBonus: 2, requiredTech: 'Currency', description: 'Increases gold production' },
  WALLS: { name: 'Walls', productionCost: 65, maintenanceCost: 1, defenseBonus: 2, requiredTech: 'Masonry', description: 'Improves city defense' },
  WORKSHOP: { name: 'Workshop', productionCost: 100, maintenanceCost: 2, productionBonus: 2, requiredTech: 'Metal Casting', description: 'Increases production output' },
};

export const WONDER_TYPES = {
  STONEHENGE: { name: 'Stonehenge', productionCost: 120, cultureBonus: 5, requiredTech: 'Calendar', description: 'Provides culture and free monument' },
  GREAT_LIBRARY: { name: 'Great Library', productionCost: 150, scienceBonus: 4, requiredTech: 'Writing', description: 'Provides a free technology' },
  PYRAMIDS: { name: 'Pyramids', productionCost: 200, workerBonus: true, requiredTech: 'Masonry', description: 'Workers build 30% faster' },
};

export const TECHNOLOGIES = {
  AGRICULTURE: { name: 'Agriculture', cost: 20, prereqs: [], unlocks: ['Pottery', 'Animal Husbandry'], description: 'The foundation of civilization' },
  POTTERY: { name: 'Pottery', cost: 35, prereqs: ['Agriculture'], unlocks: ['Writing', 'Calendar'], description: 'Allows Granaries for food storage' },
  ANIMAL_HUSBANDRY: { name: 'Animal Husbandry', cost: 35, prereqs: ['Agriculture'], unlocks: ['Trapping', 'The Wheel'], description: 'Reveals horses and allows pastures' },
  ARCHERY: { name: 'Archery', cost: 35, prereqs: ['Agriculture'], unlocks: ['Mathematics'], description: 'Enables Archer units' },
  MINING: { name: 'Mining', cost: 35, prereqs: ['Agriculture'], unlocks: ['Bronze Working', 'Masonry'], description: 'Allows mining resources and constructing mines' },
  SAILING: { name: 'Sailing', cost: 45, prereqs: ['Agriculture'], unlocks: ['Optics'], description: 'Enables work boats and coastal improvements' },
  WRITING: { name: 'Writing', cost: 55, prereqs: ['Pottery'], unlocks: ['Philosophy'], description: 'Enables Libraries and the Great Library wonder' },
  CALENDAR: { name: 'Calendar', cost: 70, prereqs: ['Pottery'], unlocks: ['Drama'], description: 'Allows plantations and the Stonehenge wonder' },
  TRAPPING: { name: 'Trapping', cost: 55, prereqs: ['Animal Husbandry'], unlocks: [], description: 'Allows camps and trading posts' },
  THE_WHEEL: { name: 'The Wheel', cost: 55, prereqs: ['Animal Husbandry'], unlocks: ['Horseback Riding'], description: 'Enables roads and chariots' },
  BRONZE_WORKING: { name: 'Bronze Working', cost: 55, prereqs: ['Mining'], unlocks: ['Iron Working'], description: 'Enables Barracks and Spearman units' },
  MASONRY: { name: 'Masonry', cost: 55, prereqs: ['Mining'], unlocks: ['Construction'], description: 'Enables Walls and Pyramids wonder' },
};

export const AI_PLAYER_IDS = [PLAYERS.AI_1.id, PLAYERS.AI_2.id, PLAYERS.AI_3.id];

// Civilization-specific city names
export const CIV_CITY_NAMES = {
  'civ1': [ // England
    "London", "York", "Nottingham", "Hastings", "Canterbury",
    "Coventry", "Warwick", "Newcastle", "Oxford", "Liverpool",
    "Dover", "Brighton", "Norwich", "Leeds", "Reading",
    "Birmingham", "Manchester", "Bristol", "Sheffield", "Bath"
  ],
  'civ2': [ // Germany
    "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt",
    "Stuttgart", "Düsseldorf", "Leipzig", "Dresden", "Hannover",
    "Nuremberg", "Bremen", "Bonn", "Essen", "Dortmund", 
    "Heidelberg", "Münster", "Augsburg", "Aachen", "Kiel"
  ],
  'civ3': [ // Russia
    "Moscow", "Saint Petersburg", "Novgorod", "Yekaterinburg", "Vladivostok",
    "Kazan", "Sochi", "Samara", "Rostov", "Nizhny Novgorod",
    "Volgograd", "Minsk", "Smolensk", "Kursk", "Arkhangelsk",
    "Yaroslavl", "Tobolsk", "Vologda", "Murmansk", "Magadan"
  ],
  'civ4': [ // America
    "Washington", "New York", "Boston", "Philadelphia", "Atlanta",
    "Chicago", "Seattle", "San Francisco", "Los Angeles", "Dallas",
    "Denver", "Miami", "New Orleans", "St. Louis", "Detroit",
    "Baltimore", "Cincinnati", "Portland", "Nashville", "Las Vegas"
  ],
  'civ5': [ // China
    "Beijing", "Shanghai", "Guangzhou", "Nanjing", "Xian",
    "Chengdu", "Hangzhou", "Tianjin", "Macau", "Suzhou",
    "Shenzhen", "Xiamen", "Shenyang", "Chongqing", "Wuhan",
    "Kunming", "Ningbo", "Luoyang", "Lanzhou", "Jinan"
  ],
  'civ6': [ // Egypt
    "Cairo", "Alexandria", "Thebes", "Memphis", "Giza",
    "Luxor", "Heliopolis", "Elephantine", "Edfu", "Abydos",
    "Karnak", "Busiris", "Avaris", "Leontopolis", "Letopolis",
    "Tanis", "Dahshur", "Nubt", "Nekhen", "Akhetaten"
  ],
  'civ7': [ // France
    "Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse",
    "Nice", "Nantes", "Strasbourg", "Reims", "Orleans",
    "Versailles", "Lille", "Brest", "Montpellier", "Dijon",
    "Tours", "Caen", "Avignon", "Grenoble", "Saint-Etienne"
  ],
  'civ8': [ // Japan
    "Tokyo", "Kyoto", "Osaka", "Sapporo", "Nagoya",
    "Yokohama", "Hiroshima", "Fukuoka", "Kobe", "Kawasaki",
    "Nagasaki", "Sendai", "Kamakura", "Nara", "Kanazawa",
    "Hakodate", "Matsuyama", "Niigata", "Toyama", "Himeji"
  ],
  'civ9': [ // Greece
    "Athens", "Sparta", "Corinth", "Thebes", "Rhodes",
    "Argos", "Knossos", "Mycenae", "Olympia", "Delphi",
    "Ephesus", "Thessalonica", "Halicarnassus", "Larissa", "Chalcis",
    "Megara", "Patras", "Marathon", "Miletus", "Byzantium"
  ],
  'civ10': [ // Rome
    "Rome", "Antium", "Cumae", "Neapolis", "Ravenna",
    "Pompeii", "Florence", "Tarentum", "Mediolanum", "Aquileia",
    "Caesarea", "Carthage", "Syracuse", "Genoa", "Venice",
    "Parma", "Brundisium", "Pisae", "Verona", "Ancona"
  ],
  'civ11': [ // Aztec
    "Tenochtitlan", "Teotihuacan", "Texcoco", "Tlatelolco", "Cholula",
    "Tlacopan", "Xochicalco", "Tula", "Calixtlahuaca", "Malinalco",
    "Ixtapaluca", "Huexotla", "Tepexpan", "Cempoala", "Chalco",
    "Coyoacan", "Chiconauhtla", "Tizatlan", "Tepetlaoztoc", "Zultepec"
  ],
  'civ12': [ // India
    "Delhi", "Mumbai", "Calcutta", "Bangalore", "Hyderabad",
    "Madras", "Patna", "Agra", "Lahore", "Jaipur",
    "Varanasi", "Vijayanagara", "Lucknow", "Ahmedabad", "Bhopal",
    "Calicut", "Surat", "Kanpur", "Mysore", "Ujjain"
  ]
};