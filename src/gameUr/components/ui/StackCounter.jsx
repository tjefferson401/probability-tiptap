import styled from "styled-components"
import { TILE_CONSTANT } from "../../util/Constant";
import { useAppContext } from "../../contexts/Context";

const StyledStackCounter = styled.div`
    position: absolute;
    transform: ${(props) => props.player === 'b' ? `translate(${3 * TILE_CONSTANT}vh, ${2 * TILE_CONSTANT}vh)` : `translate(${3 * TILE_CONSTANT}vh, ${0 * TILE_CONSTANT}vh)`};
    background-color: ${(props) => props.player === 'r' ? `rgba(255, 99, 71, 0.3)` : `rgba(78, 148, 154, 0.3)`};
    width: ${TILE_CONSTANT/4}vh;
    height: ${TILE_CONSTANT/4}vh;
    border-radius: 20%;
    margin-top: ${TILE_CONSTANT/32}vh;
    margin-left: ${TILE_CONSTANT/32}vh;
    padding-top: ${TILE_CONSTANT/32}vh;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;

    h2 {
        font-size: calc(1vw + 1vh + 0.5vmin); /* Example of scaling based on viewport */
        /* Adjust the formula as needed to fit your design */
    }
`

const StackCounter = (props) => {
    const { appState } = useAppContext();
    const count = props.player === 'r' ? appState.redStack : appState.blueStack;

    return (
        <StyledStackCounter player={props.player}>
            <h2>{count}</h2>
        </StyledStackCounter>
    )
};

export default StackCounter;