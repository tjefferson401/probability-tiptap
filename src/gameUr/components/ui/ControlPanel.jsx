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
    height: 50%;
    aspect-ratio: 1 / 1;
    box-shadow: 0 0 2vh rgba(0, 0, 0, 0.5);
    transition: background-color 0.3s ease-in-out;
    background-color: ${props => props.turn === "r" ? "tomato" : "#4e949a"};
    display: flex;
    flex-direction: column;
    gap: 5%;
    border-radius: 5%;
    padding: 0.5%;
`;

const StyledButton = styled(Button)`
    height: 25%;

    p {
        font-size: 100%;
    }
`;

// const StyledButton = styled(Button)`
//     &.btn-primary {
//         transition: background-color 0.5s ease-in-out, border-color 0.5s ease-in-out;
//         background-color: ${props => props.turn === "r" ? "white" : "black"};
//         border-color: ${props => props.turn === "r" ? "white" : "black"};

//         &:hover, &:focus, &:active {
//             background-color: ${props => props.turn === "r" ? "lightgray" : "darkgray"};
//             border-color: ${props => props.turn === "r" ? "lightgray" : "darkgray"};
//         }
//     }
// `;

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
            <StyledButton 
                onClick={() => dispatch(Dispatcher.rollDice())} 
                disabled={appState.diceOff} 
                variant="primary" 
                turn={appState.turn}
            >
                <p>Roll Dice</p>
            </StyledButton>            
            <Dice/>
        </StyledControlPanel>
    );
}

export default ControlPanel;
