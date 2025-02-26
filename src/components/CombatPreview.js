import React from 'react';
import './CombatPreview.css';
import { UNIT_TYPES } from '../constants';

const CombatPreview = ({ attacker, defender, onConfirm, onCancel }) => {
  if (!attacker || !defender) return null;
  
  // Get unit details
  const attackerType = Object.values(UNIT_TYPES).find(u => u.name === attacker.type);
  const defenderType = Object.values(UNIT_TYPES).find(u => u.name === defender.type);
  
  // Calculate combat odds (simplified)
  const attackerStrength = attackerType.strength;
  const defenderStrength = defenderType.strength;
  
  const totalStrength = attackerStrength + defenderStrength;
  const attackerOdds = attackerStrength / totalStrength * 100;
  const defenderOdds = defenderStrength / totalStrength * 100;
  
  // Predict victory
  const predictedVictor = attackerStrength > defenderStrength ? 'attacker' : 'defender';
  
  // Get unit icons
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
    <div className="combat-preview">
      <div className="combat-unit attacker">
        <div 
          className="combat-unit-icon" 
          style={{ backgroundColor: attacker.player === 'human' ? '#4CAF50' : '#FF5722' }}
        >
          {getUnitIcon(attacker.type)}
        </div>
        <div className="combat-unit-name">{attacker.type}</div>
        <div className="combat-stats">
          <div className="combat-stat">
            <span className="combat-stat-label">Strength:</span>
            <span className="combat-stat-value">{attackerStrength}</span>
          </div>
          <div className="combat-stat">
            <span className="combat-stat-label">Odds:</span>
            <span className="combat-stat-value">{Math.round(attackerOdds)}%</span>
          </div>
        </div>
        {predictedVictor === 'attacker' && (
          <div className="combat-result victory">
            Predicted Victory
          </div>
        )}
      </div>
      
      <div className="combat-vs">
        VS
      </div>
      
      <div className="combat-unit defender">
        <div 
          className="combat-unit-icon" 
          style={{ backgroundColor: defender.player === 'human' ? '#4CAF50' : '#FF5722' }}
        >
          {getUnitIcon(defender.type)}
        </div>
        <div className="combat-unit-name">{defender.type}</div>
        <div className="combat-stats">
          <div className="combat-stat">
            <span className="combat-stat-label">Strength:</span>
            <span className="combat-stat-value">{defenderStrength}</span>
          </div>
          <div className="combat-stat">
            <span className="combat-stat-label">Odds:</span>
            <span className="combat-stat-value">{Math.round(defenderOdds)}%</span>
          </div>
        </div>
        {predictedVictor === 'defender' && (
          <div className="combat-result victory">
            Predicted Victory
          </div>
        )}
      </div>
      
      <div className="combat-actions">
        <button className="combat-action attack" onClick={onConfirm}>
          Attack
        </button>
        <button className="combat-action cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CombatPreview;