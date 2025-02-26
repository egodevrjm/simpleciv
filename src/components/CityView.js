import React, { useState } from 'react';
import './CityView.css';
import { UNIT_TYPES, BUILDING_TYPES, WONDER_TYPES } from '../constants';

const CityView = ({ city, researchedTechs, onSetProduction, onQueueProduction, onClose }) => {
  const [selectedTab, setSelectedTab] = useState('info');
  
  if (!city) return null;
  
  // Calculate turns remaining for current production
  const getTurnsRemaining = (productionCost) => {
    if (!city.currentProduction || city.productionPerTurn <= 0) return '∞';
    
    const remaining = productionCost - city.production;
    return Math.ceil(remaining / city.productionPerTurn);
  };
  
  // Filter available units/buildings based on researched technologies
  const getAvailableUnits = () => {
    return Object.values(UNIT_TYPES);
  };
  
  const getAvailableBuildings = () => {
    return Object.values(BUILDING_TYPES).filter(building => {
      // If no required tech, or we have researched it
      return !building.requiredTech || researchedTechs.includes(building.requiredTech);
    });
  };
  
  const getAvailableWonders = () => {
    return Object.values(WONDER_TYPES).filter(wonder => {
      // If no required tech, or we have researched it
      return (!wonder.requiredTech || researchedTechs.includes(wonder.requiredTech)) && 
             // Check if we've already built it
             !city.buildings.includes(wonder.name);
    });
  };
  
  // Check if a building is already constructed
  const hasBuildingBeenConstructed = (buildingName) => {
    return city.buildings.includes(buildingName);
  };
  
  // Render current production with progress bar
  const renderCurrentProduction = () => {
    if (!city.currentProduction) {
      return (
        <div className="production-item production-none">
          <div className="production-icon">🚫</div>
          <div className="production-details">
            <h4>No Production</h4>
            <p>Select something to produce</p>
          </div>
        </div>
      );
    }
    
    const { type, id } = city.currentProduction;
    let icon = '🔨';
    let name = id;
    let description = '';
    let productionCost = 0;
    
    if (type === 'unit') {
      const unit = Object.values(UNIT_TYPES).find(unit => unit.name === id);
      if (unit) {
        icon = unit.name === 'settler' ? '👨‍👩‍👧' : 
               unit.name === 'warrior' ? '⚔️' : 
               unit.name === 'archer' ? '🏹' : '👁️';
        name = unit.name.charAt(0).toUpperCase() + unit.name.slice(1);
        description = unit.description;
        productionCost = unit.productionCost;
      }
    } else if (type === 'building') {
      const building = Object.values(BUILDING_TYPES).find(b => b.name === id);
      if (building) {
        icon = '🏛️';
        name = building.name;
        description = building.description;
        productionCost = building.productionCost;
      }
    } else if (type === 'wonder') {
      const wonder = Object.values(WONDER_TYPES).find(w => w.name === id);
      if (wonder) {
        icon = '🗿';
        name = wonder.name;
        description = wonder.description;
        productionCost = wonder.productionCost;
      }
    }
    
    const progress = Math.min(city.production / productionCost * 100, 100);
    const turnsRemaining = getTurnsRemaining(productionCost);
    
    return (
      <div className="production-item production-current">
        <div className="production-icon">{icon}</div>
        <div className="production-details">
          <h4>{name}</h4>
          <p>{description}</p>
          <div className="production-progress-container">
            <div 
              className="production-progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="production-stats">
            <span>{city.production}/{productionCost} ({Math.floor(progress)}%)</span>
            <span>{turnsRemaining} turns remaining</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Render different tabs
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'info':
        return (
          <div className="city-info-tab">
            <div className="city-stats">
              <div className="stat-item">
                <span className="stat-icon">👥</span>
                <span className="stat-label">Population:</span>
                <span className="stat-value">{city.population}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🌾</span>
                <span className="stat-label">Food:</span>
                <span className="stat-value">{city.food}/{city.foodNeeded} (+{city.foodPerTurn}/turn)</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🔨</span>
                <span className="stat-label">Production:</span>
                <span className="stat-value">{city.production} (+{city.productionPerTurn}/turn)</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💰</span>
                <span className="stat-label">Gold:</span>
                <span className="stat-value">{city.gold} (+{city.goldPerTurn}/turn)</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🧪</span>
                <span className="stat-label">Science:</span>
                <span className="stat-value">{city.science} (+{city.sciencePerTurn}/turn)</span>
              </div>
            </div>
            
            <h3>Current Production</h3>
            {renderCurrentProduction()}
            
            <h3>Buildings</h3>
            <div className="buildings-list">
              {city.buildings.length > 0 ? (
                city.buildings.map((building, index) => (
                  <div key={index} className="building-item">
                    <span className="building-icon">🏛️</span>
                    <span className="building-name">{building}</span>
                  </div>
                ))
              ) : (
                <p>No buildings yet</p>
              )}
            </div>
          </div>
        );
        
      case 'production':
        return (
          <div className="production-tab">
            <h3>Current Production</h3>
            {renderCurrentProduction()}
            
            <h3>Units</h3>
            <div className="production-options">
              {getAvailableUnits().map((unit, index) => (
                <div 
                  key={`unit-${index}`} 
                  className="production-option"
                  onClick={() => {
                    console.log('Starting production:', city.name, 'unit', unit.name, 'cost:', unit.productionCost);
                    onSetProduction(city, 'unit', unit.name);
                  }}
                  style={{cursor: 'pointer'}}
                >
                  <div className="production-option-icon">
                    {unit.name === 'settler' ? '👨‍👩‍👧' : 
                     unit.name === 'warrior' ? '⚔️' : 
                     unit.name === 'archer' ? '🏹' : '👁️'}
                  </div>
                  <div className="production-option-details">
                    <h4>{unit.name.charAt(0).toUpperCase() + unit.name.slice(1)}</h4>
                    <p>{unit.description}</p>
                    <div className="production-option-cost">
                      <span>Cost: {unit.productionCost}</span>
                      <span>Turns: {getTurnsRemaining(unit.productionCost)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <h3>Buildings</h3>
            <div className="production-options">
              {getAvailableBuildings().map((building, index) => {
                const isBuilt = hasBuildingBeenConstructed(building.name);
                return (
                  <div 
                    key={`building-${index}`} 
                    className={`production-option ${isBuilt ? 'disabled' : ''}`}
                    onClick={() => !isBuilt && onSetProduction(city, 'building', building.name)}
                  >
                    <div className="production-option-icon">🏛️</div>
                    <div className="production-option-details">
                      <h4>{building.name}</h4>
                      <p>{building.description}</p>
                      {isBuilt ? (
                        <div className="production-option-built">Already built</div>
                      ) : (
                        <div className="production-option-cost">
                          <span>Cost: {building.productionCost}</span>
                          <span>Turns: {getTurnsRemaining(building.productionCost)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <h3>Wonders</h3>
            <div className="production-options">
              {getAvailableWonders().map((wonder, index) => (
                <div 
                  key={`wonder-${index}`} 
                  className="production-option wonder"
                  onClick={() => onSetProduction(city, 'wonder', wonder.name)}
                >
                  <div className="production-option-icon">🗿</div>
                  <div className="production-option-details">
                    <h4>{wonder.name}</h4>
                    <p>{wonder.description}</p>
                    <div className="production-option-cost">
                      <span>Cost: {wonder.productionCost}</span>
                      <span>Turns: {getTurnsRemaining(wonder.productionCost)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="city-view-overlay">
      <div className="city-view">
        <div className="city-view-header">
          <h2>{city.name} (Population: {city.population})</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="city-view-tabs">
          <button 
            className={`tab-btn ${selectedTab === 'info' ? 'active' : ''}`} 
            onClick={() => setSelectedTab('info')}
          >
            City Info
          </button>
          <button 
            className={`tab-btn ${selectedTab === 'production' ? 'active' : ''}`} 
            onClick={() => setSelectedTab('production')}
          >
            Production
          </button>
        </div>
        
        <div className="city-view-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CityView;