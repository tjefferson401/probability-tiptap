import React, { useState } from 'react';
import Switch from 'react-switch';
import { useAppContext } from './BeamSearchContext';
import styled from 'styled-components';

// Styled components
const ToggleSwitchContainer = styled.div`
  display: flex;
  align-items: left;
  justify-content: left;
  padding: 10px;
`;

const ToggleSwitchLabel = styled.label`
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  color: #555;
`;

const ToggleSwitchText = styled.span`
  margin-left: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
`;


const ToggleSwitch = () => {

  const { setConfig, config } = useAppContext();

  const handleChange = (nextChecked) => {
    setConfig({ ...config, showLogProbs: nextChecked });
  };

  return (
    <ToggleSwitchContainer>
      <ToggleSwitchLabel>
        <Switch 
          onChange={handleChange} 
          checked={config.showLogProbs}
          onColor="#1e88e5" // Green when active
          offColor="#ccc" // Gray when inactive
          checkedIcon={false} 
          uncheckedIcon={false} 
          height={20} 
          width={48} 
          handleDiameter={24} 
        />

        <ToggleSwitchText>
          {config.showLogProbs ? 'Toggle Rank' : 'Toggle Log Probabilities'}
        </ToggleSwitchText>

      </ToggleSwitchLabel>
    </ToggleSwitchContainer>
  );
};

export default ToggleSwitch;
