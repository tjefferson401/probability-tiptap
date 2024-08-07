import { useAppContext } from "../../contexts/Context";
import Dispatcher from "../../util/Dispatcher";
import tutorialIcon from "../../../assets/react.svg";

export const Tutorial = () => {
    const { dispatch } = useAppContext();
    return (
        <div>
            <h1>How to Play</h1>
            <p>The Royal Game of Ur is a two-player strategy</p>
            <button onClick={() => dispatch(Dispatcher.toggleTutorial())}>Play Game</button>
        </div>
    );
}

export const TutorialButton = () => {
    const { dispatch } = useAppContext();
    return (
        <div style={{ position: 'relative' }}>
            <button 
                className="btn btn-primary rounded-circle p-3 lh-1" 
                type="button" 
                onClick={() => dispatch(Dispatcher.toggleTutorial())}
                style={{
                    position: 'absolute',
                    bottom: '10px', // Adjust as needed
                    right: '10px',  // Adjust as needed
                }}
            >
                <img src={tutorialIcon} alt="Tutorial Icon" style={{ width: '24px', height: '24px' }} />
            </button>
        </div>
    );
}