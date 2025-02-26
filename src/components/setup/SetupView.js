import React, { useState } from 'react';
import './SetupView.css';
import logo from '../../assets/logo.png';

// Available civilizations with their traits, starting bonuses and historical cities
const CIVILIZATIONS = [
  {
    id: 'america',
    name: 'America',
    leader: 'Abraham Lincoln',
    flagEmoji: '🇺🇸',
    trait: 'Manifest Destiny',
    description: 'All land military units have +1 sight. 50% discount when purchasing tiles.',
    startingBonus: 'B17 Bomber',
    cities: ['Washington', 'New York', 'Boston', 'Philadelphia', 'Atlanta', 'Chicago', 'Seattle', 'San Francisco', 'Los Angeles', 'Houston']
  },
  {
    id: 'rome',
    name: 'Rome',
    leader: 'Augustus Caesar',
    flagEmoji: '🇮🇹',
    trait: 'The Glory of Rome',
    description: '+25% production towards any buildings that already exist in the Capital.',
    startingBonus: 'Legion',
    cities: ['Rome', 'Antium', 'Cumae', 'Neapolis', 'Ravenna', 'Arretium', 'Mediolanum', 'Arpinum', 'Circei', 'Venusia']
  },
  {
    id: 'ukraine',
    name: 'Ukraine',
    leader: 'Yaroslav the Wise',
    flagEmoji: '🇺🇦',
    trait: 'Breadbasket of Europe',
    description: 'Farms provide +1 Food and increased gold from trade routes.',
    startingBonus: 'Cossack Horseman',
    cities: ['Kyiv', 'Lviv', 'Kharkiv', 'Odesa', 'Dnipro', 'Zaporizhzhia', 'Donetsk', 'Chernihiv', 'Poltava', 'Chernivtsi']
  },
  {
    id: 'germany',
    name: 'Germany',
    leader: 'Frederick Barbarossa',
    flagEmoji: '🇩🇪',
    trait: 'Furor Teutonicus',
    description: 'Upon defeating a Barbarian unit inside an encampment, there is a 67% chance to earn Gold and they join your side.',
    startingBonus: 'U-Boat',
    cities: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dresden', 'Hannover']
  },
  {
    id: 'china',
    name: 'China',
    leader: 'Wu Zetian',
    flagEmoji: '🇨🇳',
    trait: 'Art of War',
    description: 'Great Generals provide +30% combat bonus and spawn 50% faster.',
    startingBonus: 'Chu-Ko-Nu',
    cities: ['Beijing', 'Shanghai', 'Guangzhou', 'Nanjing', 'Xian', 'Chengdu', 'Hangzhou', 'Tianjin', 'Macau', 'Shandong']
  },
  {
    id: 'india',
    name: 'India',
    leader: 'Gandhi',
    flagEmoji: '🇮🇳',
    trait: 'Population Growth',
    description: 'Unhappiness from number of Cities is doubled, Unhappiness from Population is halved.',
    startingBonus: 'War Elephant',
    cities: ['Delhi', 'Mumbai', 'Bangalore', 'Calcutta', 'Jaipur', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Pune', 'Surat']
  },
  {
    id: 'england',
    name: 'England',
    leader: 'Queen Elizabeth I',
    flagEmoji: '🇬🇧',
    trait: 'Sun Never Sets',
    description: 'Naval units receive +2 movement and +1 sight radius.',
    startingBonus: 'Ships of the Line',
    cities: ['London', 'York', 'Nottingham', 'Hastings', 'Canterbury', 'Coventry', 'Warwick', 'Newcastle', 'Oxford', 'Liverpool']
  },
  {
    id: 'france',
    name: 'France',
    leader: 'Napoleon Bonaparte',
    flagEmoji: '🇫🇷',
    trait: 'Cultural Diplomacy',
    description: '+2 Culture from each city with a wonder. Museums and Hermitage provide +2 Culture.',
    startingBonus: 'Musketeer',
    cities: ['Paris', 'Orleans', 'Lyon', 'Troyes', 'Tours', 'Marseille', 'Chartres', 'Avignon', 'Bordeaux', 'Nice']
  },
  {
    id: 'japan',
    name: 'Japan',
    leader: 'Oda Nobunaga',
    flagEmoji: '🇯🇵',
    trait: 'Bushido',
    description: 'Units fight as though they were at full strength even when damaged.',
    startingBonus: 'Samurai',
    cities: ['Kyoto', 'Osaka', 'Tokyo', 'Satsuma', 'Kagoshima', 'Nara', 'Nagoya', 'Izumo', 'Nagasaki', 'Yokohama']
  },
  {
    id: 'egypt',
    name: 'Egypt',
    leader: 'Ramesses II',
    flagEmoji: '🇪🇬',
    trait: 'Monument Builders',
    description: '+20% production when building wonders.',
    startingBonus: 'War Chariot',
    cities: ['Thebes', 'Memphis', 'Heliopolis', 'Alexandria', 'Pi-Ramesses', 'Giza', 'Byblos', 'Akhetaten', 'Hieraconpolis', 'Abydos']
  },
  {
    id: 'greece',
    name: 'Greece',
    leader: 'Alexander',
    flagEmoji: '🇬🇷',
    trait: 'Hellenic League',
    description: 'City-State influence degrades at half and recovers at twice the normal rate.',
    startingBonus: 'Companion Cavalry',
    cities: ['Athens', 'Sparta', 'Corinth', 'Argos', 'Knossos', 'Mycenae', 'Pharsalos', 'Ephesus', 'Halicarnassus', 'Rhodes']
  },
  {
    id: 'aztec',
    name: 'Aztec',
    leader: 'Montezuma',
    flagEmoji: '🇲🇽',
    trait: 'Sacrificial Captives',
    description: 'Gains Culture for the empire from each enemy unit killed.',
    startingBonus: 'Jaguar',
    cities: ['Tenochtitlan', 'Texcoco', 'Tlatelolco', 'Tlacopan', 'Cempoala', 'Teotihuacan', 'Tlaxcala', 'Calixtlahuaca', 'Xochicalco', 'Cholula']
  },
  {
    id: 'brazil',
    name: 'Brazil',
    leader: 'Pedro II',
    flagEmoji: '🇧🇷',
    trait: 'Carnival',
    description: 'Tourism and Culture output increased by 100% during Golden Ages.',
    startingBonus: 'Pracinha',
    cities: ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Brasília', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre']
  },
  {
    id: 'korea',
    name: 'Korea',
    leader: 'Sejong',
    flagEmoji: '🇰🇷',
    trait: 'Scholars of the Jade Hall',
    description: '+2 Science from all Specialists and Great Person improvements provide +2 Science.',
    startingBonus: 'Hwach\'a',
    cities: ['Seoul', 'Busan', 'Jeonju', 'Daegu', 'Pyongyang', 'Kaesong', 'Suwon', 'Gwangju', 'Gangneung', 'Hamhung']
  },
  {
    id: 'spain',
    name: 'Spain',
    leader: 'Isabella',
    flagEmoji: '🇪🇸',
    trait: 'Seven Cities of Gold',
    description: 'Gold bonus for discovering Natural Wonders first. Tile yields from Natural Wonders doubled.',
    startingBonus: 'Conquistador',
    cities: ['Madrid', 'Barcelona', 'Seville', 'Córdoba', 'Toledo', 'Santiago', 'Salamanca', 'Murcia', 'Zaragoza', 'Valencia']
  },
  {
    id: 'persia',
    name: 'Persia',
    leader: 'Darius I',
    flagEmoji: '🇮🇷',
    trait: 'Achaemenid Legacy',
    description: 'Golden Ages last 50% longer. +10% Strength and +1 Movement for all units during Golden Ages.',
    startingBonus: 'Immortal',
    cities: ['Persepolis', 'Pasargadae', 'Susa', 'Ecbatana', 'Sardis', 'Babylon', 'Damascus', 'Tarsus', 'Gordium', 'Bactra']
  }
];

const SetupView = ({ onStartGame }) => {
  const [selectedCiv, setSelectedCiv] = useState(null);
  const [leaderName, setLeaderName] = useState('');
  const [difficulty, setDifficulty] = useState('normal');
  const [mapSize, setMapSize] = useState('standard');
  const [showAllCivs, setShowAllCivs] = useState(false);

  const handleCivSelect = (civ) => {
    setSelectedCiv(civ);
    setLeaderName(civ.leader); // Pre-fill with the historical leader name
  };

  const handleStartGame = () => {
    if (selectedCiv && leaderName) {
      onStartGame({
        playerCiv: selectedCiv,
        leaderName,
        difficulty,
        mapSize: mapSize === 'small' ? 20 : mapSize === 'standard' ? 30 : mapSize === 'large' ? 40 : 50
      });
    }
  };

  // Display either all civs or just the first 10
  const displayedCivs = showAllCivs ? CIVILIZATIONS : CIVILIZATIONS.slice(0, 10);

  return (
    <div className="setup-view">
      <div className="setup-header">
        <img src={logo} alt="SimpleCiv" className="setup-logo" />
        <h2>Choose Your Civilization</h2>
      </div>
      <div className="civ-selection-container">
        <div className="civ-grid">
          {displayedCivs.map((civ) => (
            <div
              key={civ.id}
              className={`civ-card ${selectedCiv?.id === civ.id ? 'selected' : ''}`}
              onClick={() => handleCivSelect(civ)}
            >
              <div className="civ-flag">{civ.flagEmoji}</div>
              <div className="civ-name">{civ.name}</div>
              <div className="civ-leader">Led by {civ.leader}</div>
            </div>
          ))}
          {!showAllCivs && CIVILIZATIONS.length > 10 && (
            <div className="civ-card show-more" onClick={() => setShowAllCivs(true)}>
              <div className="show-more-content">
                <div className="show-more-icon">+</div>
                <div className="show-more-text">Show More Civilizations</div>
              </div>
            </div>
          )}
        </div>
        {selectedCiv && (
          <div className="civ-details">
            <div className="civ-details-header">
              <div className="civ-flag large">{selectedCiv.flagEmoji}</div>
              <div>
                <h3>{selectedCiv.name}</h3>
                <p>Led by {selectedCiv.leader}</p>
              </div>
            </div>
            <div className="civ-details-content">
              <div className="civ-trait">
                <h4>{selectedCiv.trait}</h4>
                <p>{selectedCiv.description}</p>
              </div>
              <div className="civ-bonus">
                <h4>Starting Bonus</h4>
                <p>{selectedCiv.startingBonus}</p>
              </div>
              <div className="civ-cities">
                <h4>Major Cities</h4>
                <div className="city-list">
                  {selectedCiv.cities.map((city, index) => (
                    <span key={index} className="city-tag">{city}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="game-options">
              <div className="option-group">
                <label>Your Leader Name:</label>
                <input
                  type="text"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="option-group">
                <label>Difficulty:</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="easy">Chieftain (Easy)</option>
                  <option value="normal">Prince (Normal)</option>
                  <option value="hard">Emperor (Hard)</option>
                  <option value="deity">Deity (Very Hard)</option>
                </select>
              </div>
              <div className="option-group">
                <label>Map Size:</label>
                <select value={mapSize} onChange={(e) => setMapSize(e.target.value)}>
                  <option value="small">Small (20x20)</option>
                  <option value="standard">Standard (30x30)</option>
                  <option value="large">Large (40x40)</option>
                  <option value="huge">Huge (50x50)</option>
                </select>
              </div>
            </div>
            <button className="start-game-btn" onClick={handleStartGame} disabled={!selectedCiv || !leaderName}>
              Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupView;