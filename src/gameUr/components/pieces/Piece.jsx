import React from 'react';
import { useAppContext } from '../../contexts/Context.jsx';
import { getMove } from "../../util/helper.js";
import Dispatcher from "../../util/Dispatcher.js";
import styled, { css } from 'styled-components';
import Rp from '../../assets/rp.png';   
import Bp from '../../assets/bp.png';   

const StyledPiece = styled.div`
    width: 12.5%;
    height: 33.3333%;
    position: absolute;
    background-size: 100%;

    &.bp { background-image: url(${Bp});}
    &.rp { background-image: url(${Rp});}

    &.p-20 { transform: translate(0%, 0%); }
    &.p-21 { transform: translate(100%, 0%); }
    &.p-22 { transform: translate(200%, 0%); }
    &.p-23 { transform: translate(300%, 0%); }
    &.p-24 { transform: translate(400%, 0%); }
    &.p-25 { transform: translate(500%, 0%); }
    &.p-26 { transform: translate(600%, 0%); }
    &.p-27 { transform: translate(700%, 0%); }

    &.p-10 { transform: translate(0%, 100%); }
    &.p-11 { transform: translate(100%, 100%); }
    &.p-12 { transform: translate(200%, 100%); }
    &.p-13 { transform: translate(300%, 100%); }
    &.p-14 { transform: translate(400%, 100%); }
    &.p-15 { transform: translate(500%, 100%); }
    &.p-16 { transform: translate(600%, 100%); }
    &.p-17 { transform: translate(700%, 100%); }

    &.p-00 { transform: translate(0%, 200%); }
    &.p-01 { transform: translate(100%, 200%); }
    &.p-02 { transform: translate(200%, 200%); }
    &.p-03 { transform: translate(300%, 200%); }
    &.p-04 { transform: translate(400%, 200%); }
    &.p-05 { transform: translate(500%, 200%); }
    &.p-06 { transform: translate(600%, 200%); }
    &.p-07 { transform: translate(700%, 200%); }
`;

const Piece = ({ row, col, piece }) => {
    const { appState, dispatch } = useAppContext();
    const { turn, position, moveLength } = appState;
    const currentPosition = position[position.length - 1];

    const onDragStart = e => {
        if (appState.piecesOn) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', `${piece},${row},${col}`);
    
            setTimeout(() => {
                e.target.style.display = 'none';
            }, 0);
        }
       
        if (turn === piece[0]) {
            const newCandidateMove = getMove(currentPosition, piece, row, col, moveLength);
            dispatch(Dispatcher.generateCandidateMove({ candidateMove: newCandidateMove }));
        }
    };

    const onDragEnd = e => e.target.style.display = "block";

    return (
        <StyledPiece 
            className={`piece ${piece} p-${row}${col}`}
            draggable={appState.piecesOn}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        />
    );
}

export default Piece;