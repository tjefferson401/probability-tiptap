import styled from "styled-components";
import { useAppContext } from "./BeamSearchContext";

const OutputBarStyle = styled.div`
    position: absolute;
    bottom: 10px; /* Adjust the margin from the bottom here */
    left: 50%;
    transform: translateX(-50%);
    background: rgba(111, 125, 255, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    z-index: 1000;
    flex-direction: column; /* Stack siblings horizontally */
`;

const OutputBar = ({ status }) => {
    const { lastMessage } = useAppContext();
    return (
        <OutputBarStyle>
            <h4>Output Sequence</h4>
            {lastMessage}
        </OutputBarStyle>
    );
}

export default OutputBar;