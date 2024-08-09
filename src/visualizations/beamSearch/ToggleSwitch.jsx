import React, { useState } from 'react';
import Switch from 'react-switch';
import { useAppContext } from './BeamSearchContext';


{/* NEED TO ADD STYLING HERE */}

const ToggleSwitch = () => {

  const { setConfig, config } = useAppContext();

  const handleChange = (nextChecked) => {
    setConfig({ ...config, showLogProbs: nextChecked });
  };

  return (
    <div>
      <label>
        <Switch onChange={handleChange} checked={config.showLogProbs} />
      </label>
      Show Log Probabilities
    </div>
  );
};

export default ToggleSwitch;
