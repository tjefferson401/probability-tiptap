import React, { useState, useEffect } from 'react';
import { useAppContext } from './BeamSearchContext';
import styled from 'styled-components';

const ControlPanelStyle = styled.div`
  width: 25%;
  background: linear-gradient(135deg, #e3f2fd, #90caf9);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ButtonStyle = styled.button`
  background: linear-gradient(135deg, #42a5f5, #1e88e5);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #1e88e5, #1565c0);
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #b0bec5;
    cursor: not-allowed;
  }

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

const SliderStyle = styled.input.attrs({ type: 'range' })`
  width: 100%;
  height: 25px;
  background: #cfd8dc;
  border-radius: 8px;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background: #42a5f5;
    cursor: pointer;
    border-radius: 50%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background 0.3s ease;
  }

  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    background: #42a5f5;
    cursor: pointer;
    border-radius: 50%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background 0.3s ease;
  }

  &:hover::-webkit-slider-thumb {
    background: #1e88e5;
  }

  &:hover::-moz-range-thumb {
    background: #1e88e5;
  }
`;


const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #90a4ae;
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #42a5f5;
    box-shadow: inset 0 2px 6px rgba(0, 123, 255, 0.3);
    outline: none;
  }
`;

const SequenceText = styled.div`
  width: 100%;
  background-color: white;
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #42a5f5;
    box-shadow: inset 0 2px 6px rgba(0, 123, 255, 0.3);
    outline: none;
  }
`

const Label = styled.label`
  font-size: 1rem; 
  color: #455a64;
  margin-bottom: 0rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem; 
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; 
`;

const SequenceContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Anchor stacked elements to the bottom */
  align-items: center;
`;

const ResetButtonStyle = styled(ButtonStyle)`
  background: linear-gradient(135deg, #90caf9, #64b5f6);
  margin-top: 1rem;

  &:hover {
    background: linear-gradient(135deg, #64b5f6, #42a5f5);
  }
`;

const ControlPanel = () => {
    const {config, setConfig, animate, generate, lastMessage} = useAppContext();
    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        if (config.tree) {
          startStepping();
        }
      }, [config.tree]);

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
      console.log("THIS IS WHAT IS IN TREE AT THIS POINT", config.tree)
        setConfig((prevConfig) => ({
            ...prevConfig,
            renderTree: {
                name: 'root',
                children: []
            },
            tree: null,
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
        <ControlPanelStyle>
            {/* {children} */}
            <InputContainer>
                <Label>Input Text: </Label>
                <Input placeholder={"Enter a message"} value={config.input} onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, input: e.target.value }))} />
            </InputContainer>

            <InputContainer>
                <Label>Beams:</Label>
                <Input value={config.numBeams} onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, numBeams: e.target.value }))} />
                <SliderStyle min="1" max="10" value={config.numBeams} onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, numBeams: e.target.value }))} />
            </InputContainer>

            <InputContainer>
                <Label>Depth:</Label>
                <Input value={config.maxDepth} onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, maxDepth: e.target.value }))} />
                <SliderStyle min="1" max="10" value={config.maxDepth} onChange={(e) => setConfig(prevConfig => ({ ...prevConfig, maxDepth: e.target.value }))} />
            </InputContainer>   


            {!showButtons ? (
                <ButtonStyle onClick={generate}>Start</ButtonStyle>
            ) : (
                <ButtonContainer>
                    <ButtonStyle onClick={() => window.dispatchEvent(new CustomEvent('stepPress'))} disabled={config.isStepDisabled}>
                        Step
                    </ButtonStyle >
                    {config.showAnimateButton && (
                        <ButtonStyle onClick={startAnimating}>Animate</ButtonStyle>
                    )}
                </ButtonContainer>
            )}

            {config.showResetButton && (
                <ResetButtonStyle onClick={reset}>Reset</ResetButtonStyle>
            )}

            <SequenceContainer>
              <h3>Generated Sequence</h3>
              <SequenceText>
                <p>{lastMessage}</p>
              </SequenceText>
            </SequenceContainer>

        </ControlPanelStyle>
    );
}

export default ControlPanel;

