/*
 * Piece.jsx
 * Implements the Pieces component for handling drag events and 
 * overlaying a single piece on the board.
 * Authors: Adam Boswell and Justin Blumencranz
 */

import React from 'react';
import Rp from '../../assets/rp.png';   
import Bp from '../../assets/bp.png';  
import Dispatcher from "../../util/Dispatcher.js";
import styled, { css } from 'styled-components';
import { useAppContext } from '../../contexts/Context.jsx';
import { getMove } from "../../util/helper.js";
 
// STYLED COMPONENTS //

const StyledPiece = styled.div`
    width: 12.5%;
    height: 33.3333%;
    position: absolute;
    background-size: 100%;

    // Gives Blue and Red Pieces their respective images
    &.bp { background-image: url(${Bp});}
    &.rp { background-image: url(${Rp});}
    
    // These define how much to translate the absolute position of each piece to display correctly on the board
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

// COMPONENTS //

/**
 * Piece component overlays a single piece on the board.
 * @param {Object} props - the row, column, and piece type of the piece to be rendered. 
 * @returns {JSX.Element} - A single Piece component rendering the correct piece at the correct board location
 */
const Piece = ({ row, col, piece }) => {
    const { appState, dispatch } = useAppContext();                 // Access and modify the appState reducer
    const { turn, moveLength } = appState;                          // Who's turn and how far to move

    /**
     * Handle when a piece is picked up
     * @param {Object} e - The event object
     */
    const onDragStart = e => {
        // Piece can only be moved after dice have been rolled (piecesOn is true)
        if (appState.piecesOn) {
            // Allow the piece image to be moved
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', `${piece},${row},${col}`);
    
            // Hide the piece on the board while dragging
            setTimeout(() => {
                e.target.style.display = 'none';
            }, 0);
        }

        // Only allow piece to move if it is that pieces turn
        // piece is either 'bp' or 'rp'
        if (turn === piece[0]) {
            // Calculate where the piece can go based on it's current location
            const newCandidateMove = getMove(piece, row, col, moveLength);
            dispatch(Dispatcher.generateCandidateMove({ candidateMove: newCandidateMove }));
        }
    };

    // Move the piece back to it's original position after dragging (piece reappears if move failed)
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