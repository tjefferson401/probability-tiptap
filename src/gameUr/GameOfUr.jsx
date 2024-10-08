import Heading from './components/ui/Heading';
import React, { useReducer } from 'react';
import ControlPanel from './components/ui/ControlPanel';
import 'bootstrap/dist/css/bootstrap.min.css';
import Board from './components/ui/Board';
import AppContext from './contexts/Context';
import { initGameState } from './util/Constant';
import { reducer } from './util/reducer';
import BarChart from './components/ui/BarChart';
import { GameWindow, BarWindow } from './styles/Windows.style';
import { Tutorial, TutorialButton } from './components/ui/Tutorial';

export function GameOfUr() {
    const [appState, dispatch] = useReducer(reducer, initGameState)
    
    const initContext = {
      appState,
      dispatch
    }

    return (
        <>
        <AppContext.Provider value={initContext}>
            {appState.showTutorial ? <Tutorial /> : (
                <>
                    <GameWindow>
                        <Board />
                        <ControlPanel />
                    </GameWindow>
                    <BarWindow>
                        <BarChart />
                    </BarWindow>
                    <TutorialButton />
                </>
            )}
        </AppContext.Provider>
        </>
    );
}

