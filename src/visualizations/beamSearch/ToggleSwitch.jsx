import React, { useState } from 'react';
import Switch from 'react-switch';
import { useAppContext } from './BeamSearchContext';

const ToggleSwitch = () => {

  const { setConfig, config, showLogProbs } = useAppContext();

  const handleChange = (nextChecked) => {
    setConfig({ ...config, showLogProbs: nextChecked });
  };

  return (
    <div>
      <label>
        <Switch onChange={handleChange} checked={config.showLogProbs} />
        {config.showLogProbs.toString()}
      </label>
    </div>
  );
};

export default ToggleSwitch;
