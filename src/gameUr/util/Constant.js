import { createPosition } from "./helper";

export const TILE_CONSTANT = 50/3;

export const initGameState = {
    position: [createPosition()],
    turn: 'b',
    candidateMove: [],
    diceRoll: [0, 0, 0, 0],
    moveLength: 0,
    diceOff: false,
    redScore: 0,
    blueScore: 0,
    redStack: 7,
    blueStack: 7,
    diceFrequency: [0, 0, 0, 0, 0, 0],
    showTutorial: true
}