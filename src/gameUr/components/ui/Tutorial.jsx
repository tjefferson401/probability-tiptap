import { useAppContext } from "../../contexts/Context";
import Dispatcher from "../../util/Dispatcher";
import tutorialIcon from "../../../assets/react.svg";

export const Tutorial = () => {
    const { dispatch } = useAppContext();
    return (
        <div>
            <h1>How to Play</h1>
            <p>The Royal Game of Ur is a two-player strategy game originating from ancient Mesopotamia around 2600 BCE</p>

            <h1>Objective</h1>
            <p>
                Be the first player to move all seven of your pieces off the board. 
            </p>

            <h1>Gameplay</h1>

            <p>
                Players will take turns rolling the dice and moving their pieces across the board. If a player lands on a rosette, they are allowed to take an extra turn.
                If a player lands on a space occupied by an opponent, the opponent's piece is sent back to the start. The only exception to this is the middle rosette, deemed as a safe space.
                If there is not a valid move to be made, the turn goes to the opposition. Pieces move in a directed path, and must be moved off the board in the direction of the player's home row.
                The first player to move all seven of their pieces off the board wins. 
            </p>

            <button onClick={() => dispatch(Dispatcher.toggleTutorial())}>Are you ready to play the Royal Game of Ur?</button>
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