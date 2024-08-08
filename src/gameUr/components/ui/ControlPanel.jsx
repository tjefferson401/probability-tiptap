import SoftenedDiv from "../../styles/SoftenedDiv.style";
import { Button } from "react-bootstrap";
import ScoreBoard from "./ScoreBoard";
import Dice from "./Dice";
import { useAppContext } from "../../contexts/Context";
import Dispatcher from "../../util/Dispatcher";
import styled from "styled-components";
import { useEffect } from "react";
import Swal from "sweetalert2";

const StyledControlPanel = styled.div`
    width: 30vh;
    height: 30vh;
    max-width: 30vw;
    max-height: 30vw;
    box-shadow: 0 0 2vh rgba(0, 0, 0, 0.5);
    transition: background-color 0.3s ease-in-out;
    background-color: ${props => props.turn === "r" ? "tomato" : "#4e949a"};
    display: flex;
    flex-direction: column;
    gap: 5%;
    border-radius: 5%;
    padding: 1%;
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
            >
                Roll Dice
            </Button>            
            <Dice/>
        </StyledControlPanel>
    );
}

export default ControlPanel;
