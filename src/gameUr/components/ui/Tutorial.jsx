import { useAppContext } from "../../contexts/Context";
import Dispatcher from "../../util/Dispatcher";

const Tutorial = () => {
    const { appState, dispatch } = useAppContext();

    return (
        <div>
            <h1>How to Play</h1>
            <p>The Royal Game of Ur is a two-player strategy</p>
            <button onClick={() => dispatch(Dispatcher.toggleTutorial())}>Play Game</button>
        </div>
    );
}

export default Tutorial;