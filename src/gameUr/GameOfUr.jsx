import Heading from './components/ui/Heading';
import React, { useReducer } from 'react';
import ControlPanel from './components/ui/ControlPanel';
import 'bootstrap/dist/css/bootstrap.min.css';
import Board from './components/ui/Board';
import './util/constants.css'
import AppContext from './contexts/Context';
import { initGameState } from './util/Constant';
import { reducer } from './util/reducer';
import BarChart from './components/ui/BarChart';
import { GameWindow, BarWindow, BoardWindow, ControlsWindow } from './styles/Windows.style';

export function GameOfUr() {
    const [appState, dispatch] = useReducer(reducer, initGameState)
    
    const initContext = {
      appState,
      dispatch
    }

    return (
        <>
        <AppContext.Provider value={initContext}>
            <GameWindow>
                <BoardWindow>
                    <Board />
                </BoardWindow>
                <ControlsWindow>
                    <ControlPanel />
                </ControlsWindow>
            </GameWindow>
            <BarWindow>
                    <BarChart />
            </BarWindow>
        </AppContext.Provider>
        </>
    );
}
