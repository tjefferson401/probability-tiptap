import { createPosition } from "./helper";

export const TILE_CONSTANT = 50/3;

export const initGameState = {
    position: [createPosition()],
    turn: 'b',
    candidateMove: [],
    diceRoll: [0, 0, 0, 0],
    moveLength: 0,
    diceOff: false,
    piecesOn: false,
    redScore: 6,
    blueScore: 6,
    redStack: 1,
    blueStack: 1,
    diceFrequency: [0, 0, 0, 0, 0, 0],
    winner: null
}