
import styled from "styled-components";
import React from "react";
import { useAppContext } from "../../contexts/Context";

const DiceBar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 2px;
`;

const Die = ({ color }) => {
    return (
        <div
            style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: color,
            }}
        ></div>
    );
};




const Dice = () => {
    const { appState } = useAppContext();
    
    return (
        <DiceBar>
            <Die color={appState.diceRoll[0] === 0 ? "black" : "white"} />
            <Die color={appState.diceRoll[1] === 0 ? "black" : "white"} />
            <Die color={appState.diceRoll[2] === 0 ? "black" : "white"} />
            <Die color={appState.diceRoll[3] === 0 ? "black" : "white"} />
        </DiceBar>
    );
};

export default Dice;