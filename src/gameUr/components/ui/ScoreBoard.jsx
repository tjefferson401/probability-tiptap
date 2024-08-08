import styled from 'styled-components';
import { useAppContext } from '../../contexts/Context';
import SoftenedDiv from '../../styles/SoftenedDiv.style';

const StyledScoreBoard = styled.div`
    background-color: pink;
    display: flex;
    flex-direction: row;
    justify-content: center; /* Center children horizontally */
    align-items: center; /* Center children vertically */
    height: 100%;
    width: 100%;
    gap: 5%; /* Add a gap of 10 pixels between the children */
`;

const StyledScoreCard = styled(SoftenedDiv)`
    background-color: white;
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    
    h2 {
        font-size: 2vw; /* Example of scaling based on viewport */
        /* Adjust the value as needed to fit your design */
    }
`;

const ScoreCard = (props) => {
    return (
        <StyledScoreCard>
            <h2>{props.player}</h2>
            <h2>{props.score}</h2>
        </StyledScoreCard>
    );
}

const ScoreBoard = () => {
    const { appState } = useAppContext();

    return (
        <StyledScoreBoard>
            <ScoreCard player="Red" score={appState.redScore}></ScoreCard>
            <ScoreCard player="Blue" score={appState.blueScore}></ScoreCard>
        </StyledScoreBoard>
    );
};

export default ScoreBoard;