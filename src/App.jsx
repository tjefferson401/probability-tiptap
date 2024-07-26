import { BrowserRouter as Router, Link, Route, Routes, createBrowserRouter } from 'react-router-dom';
import { FileStructureOuter } from './Textbook';
import { GameOfUr } from './gameUr/GameOfUr';
import { BeamSearch } from './visualizations/beamSearch/BeamSearch';


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
        element: <BeamSearch/>
    }
])