// action in 2 parts -- payload and type
import { canMove } from "./helper"
import ActionTypes from "./ActionTypes"
import { rollDice } from "./helper"

// based on the payload and the type we change the state 
export const reducer = (state, action) => {
    switch(action.type) {

        case ActionTypes.ROLL_DICE : {
            let { turn } = state;
            const newDiceRoll = rollDice();
            const newMoveLength = newDiceRoll.reduce((sum, value) => sum + value, 0); // summing up values in an array

            console.log("You may move ", newMoveLength, " spaces.");
            // console.log("AppState: ", state)

            if (!newMoveLength || !canMove(state.position[0], turn, newMoveLength)) {
                turn = turn === 'b' ? 'r' : 'b'
                state.diceOff = false
            } else {
                state.diceOff = true
            }

            state.diceFrequency[newMoveLength] += 1

            return {
                ...state,
                turn,
                diceRoll: newDiceRoll,
                moveLength: newMoveLength,
                diceOff: state.diceOff,
                piecesOn: Boolean(newMoveLength),
                diceFrequency: state.diceFrequency
            };
        };

        case ActionTypes.MOVE_PIECE : { // if the action is new-move, then 
            let {turn, position} = state

            position = [
                ...position,
                action.payload.newPosition
            ]

            const recentCoords = [action.payload.x, action.payload.y]
            console.log("Moved piece to position: ", recentCoords[0], recentCoords[1])

            const rosettesList = [[2, 1], [0, 1], [1, 4], [2, 7], [0, 7]]

            if (!rosettesList.find(m => m[0] === recentCoords[0] && m[1] === recentCoords[1])) {
                turn = turn === 'b' ? 'r' : 'b'
            }

            const addRed = 1 ? recentCoords[0] === 2 && recentCoords[1] === 2 : 0;
            const addBlue = 1 ? recentCoords[0] === 0 && recentCoords[1] === 2 : 0;

            const newRedScore = state.redScore + addRed;
            const newBlueScore = state.blueScore + addBlue;

            return {
                ...state, // return whatever the state was
                turn,
                position,
                diceOff: false,
                piecesOn: false,
                redScore: newRedScore,
                blueScore: newBlueScore,
                winner: newRedScore === 7 ? 'r' : newBlueScore === 7 ? 'b' : null
            };
        };

        case ActionTypes.GENERATE_CANDIDATE_MOVE : {
            return {
                ...state,
                candidateMove: action.payload.candidateMove
            };
        };

        case ActionTypes.CAPTURE : {
            if (action.payload.piece === 'b') {
                return {
                    ...state,
                    blueStack: state.blueStack + 1
                }
            } else {
                return {
                    ...state,
                    redStack: state.redStack + 1
                }
            }
        }

        case ActionTypes.DECREMENT_RED_STACK : {
            return {
                ...state,
                redStack: state.redStack - 1
            }
        }

        case ActionTypes.DECREMENT_BLUE_STACK : {    
            return {
                ...state,
                blueStack: state.blueStack - 1
            }
        }

        // case ActionTypes.TOGGLE_DICE : {

        //     console.log(state.diceOff)
        //     return {
        //         ...state,
        //         diceOff: state.diceOff

        //     }
        // }

        case ActionTypes.CLEAR_CANDIDATE_MOVE : {
            return {
                ...state,
                candidateMove : []
            }
        }
        
        case ActionTypes.SCORE : {

        }

        default : // if not a new-move return the state
            // console.log("Default case. Returning state.")
            return state;
    };
};