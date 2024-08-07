import SoftenedDiv from "../../styles/SoftenedDiv.style";
import { Button } from "react-bootstrap";
import ScoreBoard from "./ScoreBoard";
import Dice from "./Dice";
import { useAppContext } from "../../contexts/Context";
import Dispatcher from "../../util/Dispatcher";
import styled from "styled-components";
import { useEffect } from "react";
import Swal from "sweetalert2";

const StyledControlPanel = styled(SoftenedDiv)`
    width: 30vh;
    height: 30vh;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease-in-out;
    background-color: ${props => props.turn === "r" ? "tomato" : "#4e949a"};
`;

const StyledButton = styled(Button)`
    &.btn-primary {
        transition: background-color 0.5s ease-in-out, border-color 0.5s ease-in-out;
        background-color: ${props => props.turn === "r" ? "white" : "black"};
        border-color: ${props => props.turn === "r" ? "white" : "black"};

        &:hover, &:focus, &:active {
            background-color: ${props => props.turn === "r" ? "lightgray" : "darkgray"};
            border-color: ${props => props.turn === "r" ? "lightgray" : "darkgray"};
        }
    }
`;

const ControlPanel = () => {
    const { appState, dispatch } = useAppContext();

    useEffect(() => {
        if (appState.winner) {
            Swal.fire({
              title: `Player ${appState.winner === "b" ? "Blue" : "Red"} wins!`,
              text: "Congratulations!",
              icon: "success",
              confirmButtonText: "Restart Game",
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(Dispatcher.resetGame());
                }
            });
        }
    }, [appState.winner]);

    console.log("Checking current turn: ", appState.turn)
    return (
        <StyledControlPanel turn={appState.turn}>
            <ScoreBoard />
            <Button 
                onClick={() => dispatch(Dispatcher.rollDice())} 
                disabled={appState.diceOff} 
                variant="primary" 
                turn={appState.turn}
                style={{width: '100%', marginBottom: '5px'}}
            >
                Roll Dice
            </Button>            
            <Dice/>
        </StyledControlPanel>
    );
}

export default ControlPanel;
