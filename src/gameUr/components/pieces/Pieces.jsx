/*
 * Pieces.jsx
 * Implements the Pieces component for handling drop events and overlaying Piece components on the board.
 * Authors: Adam Boswell and Justin Blumencranz
 */

import styled from 'styled-components';
import Piece from './Piece.jsx';
import StackCounter from '../ui/StackCounter.jsx';
import Dispatcher from '../../util/Dispatcher.js';
import { useRef } from 'react';
import { copyPosition } from '../../util/helper.js';
import { useAppContext } from '../../contexts/Context.jsx';
import { TILE_CONSTANT } from '../../util/Constant.js';


// STYLED COMPONENTS //

const StyledPieces = styled.div`
    position: absolute;
    width: calc(8 * ${TILE_CONSTANT}vh);          					// Match the width of the grid 
    height: calc(3 * ${TILE_CONSTANT}vh);         					// Match the height of the grid 
    left: 50%;                                 					 	// Center horizontally 
    top: 50%;                                   					// Center vertically
    transform: translate(-50%, -50%);           					// Offset the centering
    box-sizing: border-box;
`

// COMPONENTS //

/**
 * Pieces overlays each piece on top of Board and handles the drag and drop events.
 * @returns {JSX.Element} - The Pieces component.
 */
const Pieces = () => {
	const ref = useRef();											// Reference to the div surrounding each Piece	
	const { appState, dispatch } = useAppContext();					// Access and modify the appState reducer
	const state = appState.position[appState.position.length - 1];  // Current board state

	/* Handle the event when a piece is dropped on the board */
	const onDrop = (e) => {
		
		/**
		 * Map screen location to grid coordinates.
		 * @param {Event} e - The event object.
		 * @returns {Object} - The calculated grid coordinates.
		 */
		const calcCoords = (e) => {
			const { width, left, top, height } = ref.current.getBoundingClientRect();
			const sizeY = height / 3;
			const sizeX = width / 8;
			const y = Math.floor((e.clientX - left) / sizeX);
			const x = 2 - Math.floor((e.clientY - top) / sizeY);
			return { x, y };
		};

		// Guard against errors when some other non-piece item on screen is dropped onto the board
		const [piece, row, col] = e.dataTransfer.getData('text').split(',');
		if (!piece || !row || !col) {
			return;
		}

		// Get a copy of the current state of the board and the coordinates of the drop location
		const newPosition = copyPosition(appState.position[appState.position.length - 1]);
		const { x, y } = calcCoords(e);

		// Disallow capturing an enemy piece on the middle rosette at (1, 4)

		if (piece !== newPosition[x][y] && newPosition[x][y] !== '' && x === 1 && y === 4) {
			return;
		}


		// There is always at most one valid location to move. Make sure drop location is that location.
		if (appState.candidateMove && appState.candidateMove[0] === x && appState.candidateMove[1] === y) {
			
			// Piece was taken from red stack. Decrement red counter and hide if stack is empty
			if ((row === '2' && col === '3' && appState.redStack > 0)) {
				dispatch(Dispatcher.decrementRedStack());
				if (appState.redStack === 1) { 				// redStack would be 0 but appState is old at this point
					newPosition[row][col] = '';
				}

			// Piece was taken from blue stack. Decrement blue counter and hide if stack is empty
			} else if ((row === '0' && col === '3' && appState.blueStack > 0)) {
				dispatch(Dispatcher.decrementBlueStack());
				if (appState.blueStack === 1) {				// blueStack would be 0 but appState is old at this point
					newPosition[row][col] = '';				
				}
			
			// Piece was move from a regular position. Remove it from the old grid location
			} else {
				newPosition[row][col] = '';
			}

			// If piece is moved on top of an enemy piece, capture it
			if (piece === 'rp' && newPosition[x][y] === 'bp') {
				dispatch(Dispatcher.capture({piece: 'b'}));
				newPosition[0][3] = 'bp';

			} else if (piece === 'bp' && newPosition[x][y] === 'rp') {
				dispatch(Dispatcher.capture({piece: 'r'}));
				newPosition[2][3] = 'rp';
			}

			// If piece is move on top of a friendly piece, cancel the move
			if (piece === newPosition[x][y]) {
				return;
			}

			/* 
			 * Move the piece to the new location, but always clear the
			 * end positions so the piece disappears once it leaves the board
			 */
			newPosition[x][y] = piece;
			newPosition[0][2] = '';
			newPosition[2][2] = '';

			// Apply changes to the board state
			dispatch(Dispatcher.movePiece({ newPosition, x, y }));
		}
		
		// Clear candidate move from appState so future pieces can't be moved to the wrong location
		dispatch(Dispatcher.clearCandidateMove())
	};

	// Prevent the default behavior for the drag over event.
	const onDragOver = (e) => e.preventDefault();

	return (
		<StyledPieces ref={ref} onDragOver={onDragOver} onDrop={onDrop}>
			{/* Map each piece on the board to a Piece component*/}
			{state.map((r, row) =>
				r.map((c, col) => 
					state[row][col] ? (
						<Piece
							key={`${row}-${col}`}
							row={row}
							col={col}
							piece={state[row][col]}
						/>
					) : null
				)
			)}

			{/* Over the stack counters for each player's stack */}
			<StackCounter player='r'/>
			<StackCounter player='b'/>
		</StyledPieces>
	);
};

export default Pieces;
