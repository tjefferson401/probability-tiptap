import styled from 'styled-components';
import Pieces from '../pieces/Pieces.jsx';
import rosette from '../../assets/rosette.png';
import dice from '../../assets/dice.png'
import eyes from '../../assets/eyes.png'
import fxf from '../../assets/four-by-four.png'
import zigZag from '../../assets/zig-zag.png'
import quad from '../../assets/quadrant.png'

import { TILE_CONSTANT } from '../../util/Constant.js';
import { useAppContext } from '../../contexts/Context.jsx';

const BoardStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(8, ${TILE_CONSTANT}vh);
  position: relative;
  box-sizing: border-box;
  margin: auto;
  justify-content: center;
  align-items: center;
  margin-top: 0px;
  margin-left: 0px;
  margin-right: 0px;
  /* background-color: #003366 */
`;

const TilesStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(8, ${TILE_CONSTANT}vh);
  grid-template-rows: repeat(3, ${TILE_CONSTANT}vh);
  width: calc(8 * ${TILE_CONSTANT}vh);
  position: relative;
  box-sizing: border-box;
`;

const TileStyle = styled.div`
  position: relative;
  border: 1px solid black;
  background: #003366;

  &.tile--light {
    background: transparent;
    border: 0px; 
    /* border: 1px solid white; */
  }

  &.tile--dark {
    background: #5f0909;
    background-image: url(${rosette});
    border: 1px solid black;
    background-repeat: no-repeat;
    background-size: cover;
  }
  
  &.tile--dice {
    background-image: url(${dice});
    border: 1px solid black;
    background-repeat: no-repeat;
    background-size: cover;
  }

  &.tile--eyes {
    background-image: url(${eyes});
    border: 1px solid black;
    background-repeat: no-repeat;
    background-size: cover;
  }

  &.tile--four-by-four {
    background-image: url(${fxf});
    border: 1px solid black;
    background-repeat: no-repeat;
    background-size: cover;
  }

  &.tile--quadrant {
    background-image: url(${quad});
    border: 1px solid black;
    background-repeat: no-repeat;
    background-size: cover;
  }

  &.tile--zigzag {
    background-image: url(${zigZag});
    border: 1px solid black;
    background-repeat: no-repeat;
    background-size: cover;
  }

  &.highlight--blue {
    background: turquoise;
    opacity: 0.5;
  }

  &.highlight--red {
    background: tomato;
    opacity: 0.5;
  }
`;

const Board = () => {

    const {appState} = useAppContext()

    // const state = appState.position[appState.position.length - 1];

    const rows= Array(3).fill().map((x, i) => 8 - i);
    const cols = Array(8).fill().map((x, i) => i+1)

    const getClassName = (i,j) => { 
        let c = 'tile'

        if ((i === 0 && j === 1) || (i === 0 && j === 7) || (i === 1 && j === 4) || (i === 2 && j === 1) || (i === 2 && j === 7)) {
          c += ' tile--dark ';

        } else if ((i === 0 && j === 2) || (i === 0 && j === 3) || (i === 2 && j === 2) || (i === 2 && j === 3)) {
          c += ' tile--light ';

        } else if ((i === 1 && j === 0) || (i === 1 && j === 3) || (i === 1 && j === 6) || (i === 2 && j === 5) || (i === 0 && j === 5)) {
          c += ' tile--dice '

        } else if ((i === 0 && j === 4) || (i === 0 && j === 6) ||(i === 2 && j === 4) || (i === 2 && j === 6) || (i === 1 && j === 1)) {
          c += ' tile--eyes '

        } else if ((i === 1 && j === 2) || (i === 1 && j === 5)) {
          c += ' tile--quadrant '

        } else if ((i === 2 && j === 0) || (i === 0 && j === 0)) {
          c += ' tile--zigzag '

        } else if ((i === 1 && j === 7)) {
          c += ' tile--four-by-four '
        }
        
        if (appState.candidateMove[0] === i && appState.candidateMove[1] === j && appState.turn === 'b') {
          c += ' highlight--blue';
        } else if (appState.candidateMove[0] === i && appState.candidateMove[1] === j && appState.turn === 'r') {
          c += ' highlight--red';
        }

      return c 
    }

    // i and j range from 1 to 8, if the sum is even, dark square
    // if the sum is odd, light square

    return (
        <BoardStyle>

            <TilesStyle>
                {rows.map((row, i) => 
                    cols.map((col, j) => 
                      <TileStyle key ={`${col}-${row}`} className={getClassName(2-i,j)}> </TileStyle> 
                    )
                )}
            </TilesStyle>
            <Pieces />
            
        </BoardStyle>
    )
}

export default Board;