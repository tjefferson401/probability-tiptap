import ActionTypes from "./ActionTypes"

// takes in a new position returns an object that can be picked up by the reducer
const rollDice = () => {
    return {
        type: ActionTypes.ROLL_DICE
    }
}

const movePiece = ({ newPosition, piece, x, y }) => {
    return {
        type: ActionTypes.MOVE_PIECE,
        payload: { newPosition, piece, x, y }
    };
}

const generateCandidateMove = ({ candidateMove }) => {
    return {
        type: ActionTypes.GENERATE_CANDIDATE_MOVE,
        payload: { candidateMove }
    }
}

const decrementRedStack = () => {
    return {
        type: ActionTypes.DECREMENT_RED_STACK
    }
}

const decrementBlueStack = () => {
    return {
        type: ActionTypes.DECREMENT_BLUE_STACK
    }
}

const capture = ({ piece }) => {

    return {
        type: ActionTypes.CAPTURE,
        payload: { piece }
    }
}

const clearCandidateMove = () => {
    return {
        type : ActionTypes.CLEAR_CANDIDATE_MOVE
    }
}

const toggleDice = () => {
    return {
        type: ActionTypes.TOGGLE_DICE,
    }
}

const resetGame = () => {
    console.log("Resetting the game ??")
    return {
        type: ActionTypes.RESET_GAME
    }
}

export default { rollDice, movePiece, generateCandidateMove, toggleDice, decrementBlueStack, decrementRedStack, capture, clearCandidateMove, resetGame};