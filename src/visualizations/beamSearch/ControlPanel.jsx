import { Slider, TextField, Button } from '@mui/material';

const ControlPanel = () => {

    const [showButtons, setShowButtons] = useState(false);

    const startStepping = () => {
        setUseTimeout(false);
        setIsRunning(true);
        setShowButtons(true); 
        setShowAnimateButton(true);
        animate([], 0); // Pass initial parameters for your animation
    };
    
    const startAnimating = () => {
        setUseTimeout(true);
        setIsRunning(true);
        setIsStepDisabled(true);
        animate(currentLayer, currentDepth); // Continue from current state
    };
    
    const reset = () => {
        setRenderTree({
            name: 'root',
            children: []
        })
        
        setUseTimeout(false);
        setIsRunning(false);
        setShowButtons(false);
        setCurrentLayer([]);
        setCurrentDepth(0);
        setShowAnimateButton(false);
        setShowResetButton(false);
        setIsStepDisabled(false);
    }
    
    return (
        <div style={{display: 'flex', height: '100vh', width: '100vw'}}>
            <div style={{ width: '25%', backgroundColor: 'blue' }}>
                {!showButtons ? (
                    <button onClick={startStepping}>Start</button>
                ) : (
                    <>
                        <button onClick={() => window.dispatchEvent(new CustomEvent('stepPress'))} disabled={isStepDisabled}>
                            Step
                        </button>
                        {showAnimateButton && (
                            <button onClick={startAnimating}>Animate</button>
                        )}
                    </>
                )}
                {showResetButton && (
                    <button onClick={reset}>Reset</button>
                )}
            </div>
        </div>
    );
}

export default ControlPanel;

