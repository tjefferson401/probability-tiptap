import { HashRouter as Router, Link, Route, Routes, createHashRouter } from 'react-router-dom';
import { FileStructureOuter } from './Textbook';
import { GameOfUr } from './gameUr/GameOfUr';
import { BeamSearch } from './visualizations/beamSearch/BeamSearch';
import { Home } from './Home';

export const router = createHashRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/files",
        element: <FileStructureOuter/>
    },
    {
        path:"/ur",
        element: <GameOfUr/>
    },
    {
        path:"/beamsearch",
        element: <BeamSearch/>
    }
])