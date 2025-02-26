import React from 'react';
import './TechTree.css';
import { TECHNOLOGIES } from '../constants';

const TechTree = ({ researchedTechs, currentResearch, researchProgress, onSetResearch, onClose }) => {
  // Function to determine if a technology can be researched
  const canResearch = (tech) => {
    // Check if already researched
    if (researchedTechs.includes(tech.name)) {
      return false;
    }
    
    // Check if all prerequisites are researched
    return tech.prereqs.every(prereq => researchedTechs.includes(prereq));
  };
  
  // Calculate progress percentage for current research
  const getResearchProgress = (tech) => {
    if (currentResearch !== tech.name) return 0;
    return Math.min((researchProgress / tech.cost) * 100, 100);
  };
  
  // Get tech status
  const getTechStatus = (tech) => {
    if (researchedTechs.includes(tech.name)) {
      return 'researched';
    }
    if (currentResearch === tech.name) {
      return 'researching';
    }
    if (canResearch(tech)) {
      return 'available';
    }
    return 'locked';
  };
  
  // Organize technologies by era for better visualization
  const eraTechs = {
    'Ancient Era': ['Agriculture', 'Pottery', 'Animal Husbandry', 'Archery', 'Mining', 'Sailing'],
    'Classical Era': ['Writing', 'Calendar', 'Trapping', 'The Wheel', 'Bronze Working', 'Masonry']
  };
  
  return (
    <div className="tech-tree-overlay">
      <div className="tech-tree">
        <div className="tech-tree-header">
          <h2>Technology Tree</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="tech-tree-content">
          {currentResearch && (
            <div className="current-research">
              <h3>Currently Researching</h3>
              <div className="research-item">
                <div className="research-icon">🧪</div>
                <div className="research-details">
                  <h4>{currentResearch}</h4>
                  <p>{Object.values(TECHNOLOGIES).find(t => t.name === currentResearch)?.description}</p>
                  <div className="research-progress-container">
                    <div 
                      className="research-progress-bar"
                      style={{ 
                        width: `${getResearchProgress(Object.values(TECHNOLOGIES).find(t => t.name === currentResearch))}%` 
                      }}
                    ></div>
                  </div>
                  <div className="research-stats">
                    <span>
                      {researchProgress}/
                      {Object.values(TECHNOLOGIES).find(t => t.name === currentResearch)?.cost} 
                      ({Math.floor(getResearchProgress(Object.values(TECHNOLOGIES).find(t => t.name === currentResearch)))}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {Object.entries(eraTechs).map(([era, techList]) => (
            <div key={era} className="tech-era">
              <h3>{era}</h3>
              <div className="tech-grid">
                {techList.map(techName => {
                  const tech = Object.values(TECHNOLOGIES).find(t => t.name === techName);
                  if (!tech) return null;
                  
                  const status = getTechStatus(tech);
                  
                  return (
                    <div 
                      key={tech.name} 
                      className={`tech-card ${status}`}
                      onClick={() => status === 'available' && onSetResearch(tech.name)}
                    >
                      <div className="tech-card-header">
                        <h4>{tech.name}</h4>
                        <div className="tech-status-icon">
                          {status === 'researched' ? '✓' : 
                           status === 'researching' ? '⏳' : 
                           status === 'available' ? '!' : '🔒'}
                        </div>
                      </div>
                      <p className="tech-description">{tech.description}</p>
                      
                      {status === 'researching' && (
                        <div className="tech-progress-container">
                          <div 
                            className="tech-progress-bar"
                            style={{ width: `${getResearchProgress(tech)}%` }}
                          ></div>
                        </div>
                      )}
                      
                      <div className="tech-details">
                        <div className="tech-cost">Cost: {tech.cost}</div>
                        {tech.prereqs.length > 0 && (
                          <div className="tech-prereqs">
                            Requires: {tech.prereqs.join(', ')}
                          </div>
                        )}
                        {tech.unlocks.length > 0 && (
                          <div className="tech-unlocks">
                            Unlocks: {tech.unlocks.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechTree;