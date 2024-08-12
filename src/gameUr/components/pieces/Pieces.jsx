import Piece from './Piece.jsx';  // Ensure Piece is imported correctly
import { useRef } from 'react';
import { copyPosition } from '../../util/helper.js';
import { useAppContext } from '../../contexts/Context.jsx';
import Dispatcher from '../../util/Dispatcher.js';
import styled from 'styled-components';
import { TILE_CONSTANT } from '../../util/Constant.js';
import StackCounter from '../ui/StackCounter.jsx';

const StyledPieces = styled.div`
    position: absolute;
    width: calc(8 * ${TILE_CONSTANT}vh);          /* Match the width of the grid */
    height: calc(3 * ${TILE_CONSTANT}vh);         /* Match the height of the grid */
    left: 50%;                                  /* Center horizontally */
    top: 50%;                                   /* Center vertically */
    transform: translate(-50%, -50%);           /* Offset the centering */
    box-sizing: border-box;
`

const Pieces = () => {
	const ref = useRef();

	const { appState, dispatch } = useAppContext();
	const state = appState.position[appState.position.length - 1];
	console.log(state)

	/**
	 * Calculates the coordinates based on the mouse event.
	 * @param {Object} e - The mouse event.
	 * @return {Object} The calculated x and y coordinates.
	 */
	const calcCoords = (e) => {
		const { width, left, top, height } = ref.current.getBoundingClientRect();
		const sizeY = height / 3;
		const sizeX = width / 8;
		const y = Math.floor((e.clientX - left) / sizeX);
		const x = 2 - Math.floor((e.clientY - top) / sizeY);
		return { x, y };
	};

	/**
	 * Handles the drop event.
	 * @param {Object} e - The drop event.
	 */
	const onDrop = (e) => {
		const newPosition = copyPosition(appState.position[appState.position.length - 1]);
		console.log(newPosition)
		const { x, y } = calcCoords(e);
		const [piece, row, col] = e.dataTransfer.getData('text').split(',');

		console.log("Piece: ", piece, "X: ", x, "Y: ", y)

		if (!piece || !row || !col) {
			return;
		}

		// console.log("New Position: ", newPosition[x][y])
		// console.log(piece !== newPosition[x][y])
		// console.log(newPosition[x][y] !== '')
		// console.log(x === 1)
		// console.log(x === 4)

		if (piece !== newPosition[x][y] && newPosition[x][y] !== '' && x === 1 && y === 4) {
			console.log("Returned Early")
			return;
		}

		if (appState.candidateMove && appState.candidateMove[0] === x && appState.candidateMove[1] === y) {
			if ((row === '2' && col === '3' && appState.redStack > 0)) {
				dispatch(Dispatcher.decrementRedStack());
				if (appState.redStack === 1) {
					newPosition[row][col] = '';
				}

			} else if ((row === '0' && col === '3' && appState.blueStack > 0)) {
				dispatch(Dispatcher.decrementBlueStack());
				if (appState.blueStack === 1) {
					newPosition[row][col] = '';
				}

			} else {
				newPosition[row][col] = '';
			}

			if (piece === 'rp' && newPosition[x][y] === 'bp') {
				dispatch(Dispatcher.capture({piece: 'b'}));
				newPosition[0][3] = 'bp';

			} else if (piece === 'bp' && newPosition[x][y] === 'rp') {
				dispatch(Dispatcher.capture({piece: 'r'}));
				newPosition[2][3] = 'rp';
			}

			if (piece === newPosition[x][y]) {
				return;
			}

			newPosition[x][y] = piece;
			newPosition[0][2] = '';
			newPosition[2][2] = '';
			dispatch(Dispatcher.movePiece({ newPosition, x, y }));
		}
		
		dispatch(Dispatcher.clearCandidateMove())
	};

	/**
	 * Prevents the default behavior for the drag over event.
	 * @param {Object} e - The drag over event.
	 */
	const onDragOver = (e) => e.preventDefault();

	return (
		<StyledPieces 
			ref={ref}
			onDragOver={onDragOver}
			onDrop={onDrop}
		>
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
			<StackCounter player='r'/>
			<StackCounter player='b'/>
		</StyledPieces>
	);
};

export default Pieces;
