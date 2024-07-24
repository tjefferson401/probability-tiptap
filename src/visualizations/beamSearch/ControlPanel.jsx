import { Slider, TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import { useAppContext } from './BeamSearchContext';

const ControlPanel = () => {

    const {config, setConfig, animate, generate} = useAppContext();

    const [showButtons, setShowButtons] = useState(false);

    const startStepping = () => {
        setConfig((prevConfig) => ({
            ...prevConfig,
            useTimeout: false,
            isRunning: true,
            showAnimateButton: true
        }));
        setShowButtons(true); 
        animate([], 0); // Pass initial parameters for your animation
    };
    
    const startAnimating = () => {
        setConfig((prevConfig) => ({
            ...prevConfig,
            useTimeout: true,
            isRunning: true,
            isStepDisabled: true
        }));

        animate(config.currentLayer, config.currentDepth); // Continue from current state
    };
    
    const reset = () => {
        setConfig((prevConfig) => ({
            ...prevConfig,
            renderTree: {
                name: 'root',
                children: []
            },
            useTimeout: false,
            isRunning: false,
            currentLayer: [],
            currentDepth: 0,
            showAnimateButton: false,
            showResetButton: false,
            isStepDisabled: false
        }));

        setShowButtons(false);
    }
    
    return (

        <div style={{ width: '25%', backgroundColor: 'blue', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            {/* {children} */}

            <button onClick={generate}>Generate!</button>
            <input value={config.input} onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, input: e.target.value }))} />

            {!showButtons ? (
                <button onClick={startStepping}>Start</button>
            ) : (
                <>
                    <button onClick={() => window.dispatchEvent(new CustomEvent('stepPress'))} disabled={config.isStepDisabled}>
                        Step
                    </button>
                    {config.showAnimateButton && (
                        <button onClick={startAnimating}>Animate</button>
                    )}
                </>
            )}
            {config.showResetButton && (
                <button onClick={reset}>Reset</button>
            )}
        </div>
    );
}

export default ControlPanel;

