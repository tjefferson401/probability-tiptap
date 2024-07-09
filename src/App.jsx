import { BrowserRouter as Router, Link, Route, Routes, createBrowserRouter } from 'react-router-dom';
import { FileStructureOuter } from './Textbook';
import { GameOfUr } from './gameUr/GameOfUr';
import { BeamSearchVis } from './visualizations/beamSearch/BeamSearchVis';


export const router = createBrowserRouter([
    {
        path: "/",
        element: <FileStructureOuter/>
    },
    {
        path:"/ur",
        element: <GameOfUr/>
    },
    {
        path:"/beamsearch",
        element: <BeamSearchVis/>
    }
])