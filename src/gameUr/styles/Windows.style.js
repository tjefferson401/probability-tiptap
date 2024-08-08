import styled from "styled-components"


export const GameWindow = styled.div`
    /* Set the display to flex and arrange items in a row */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    /* Set the width to 100% and the height to 50vh */
    width: 100%;
    height: 50vh;

    /* Set the background color to #f0f0f0 */
    background-color: #f0f0f0;
`;

export const BarWindow = styled.div`
    width: 100%;
    height: 50vh;
    /* background-color: yellow; */
    /* Center the contents horizontally and vertically */
    display: flex;
    justify-content: center;
    align-items: center;
`;