import { useEffect, useRef, useState } from "react";
import { Slider, TextField, Button } from '@mui/material';
import Markdown from 'markdown-to-jsx';

import TreeComponent from './TreeComponent'
import AppContext from './BeamSearchContext'

export const BeamSearchVis = () => {
    const worker = useRef(null);                            // reference to the WebWorker that persists across renders
    const [lastMessage, setLastMessage] = useState("");     // the last partial sequence received from the WebWorker
    const [input, setInput] = useState("");                 // text the user inputs from which the model generates beams
    
    const initialTreeData = {
        name: 'root',
        children: [
            {
                name: 'Hello my name is',
                children: [
                    {
                        name: 'Justin',
                        score: 0.05,
                        children: [
                            {
                                name: '.',
                                score: 0.008,
                                children: []
                            },
                            {
                                name: ',',
                                score: 0.015,
                                children: [
                                    {
                                        name: '!',
                                        score: 0.002,
                                        children: []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'Adam',
                        score: 0.01,
                        children: [
                            {
                                name: '.',
                                score: 0.008,
                                children: [
                                    {
                                        name: '!',
                                        score: 0.002,
                                        children: []
                                    }
                                ]
                            },
                            {
                                name: ',',
                                score: 0.015,
                                children: []
                            }
                        ]
                    },
                ]
            }
        ]
    }
    
    const [tree, setTree] = useState(initialTreeData);      // the tree data that the d3-tree component renders
    const initialState = {                                  // package the tree and setTree functions into an object to pass to the context
        tree,
        setTree
    };



    // const [numberSteps, setNumberSteps] = useState(5);
    // const [numberBeams, setNumberBeams] = useState(4);
    // const [lengthPenalty, setLengthPenalty] = useState(1.0);
    // const [numReturnSequences, setNumReturnSequences] = useState(3);
    // const [output, setOutput] = useState({ html: "", markdown: "" });
    
    // Create a new WebWorker when the component mounts
    useEffect(() => {
        // Create a new WebWorker if one does not already exist
        if (worker.current === null) {
            worker.current = new Worker(new URL('./beamSearchWorker.js', import.meta.url), { type: 'module' });
        }

        // When the worker returns an output, update the lastMessage to be the "most likely" sequence at that point
        const onMessage = (event) => {
            if (event.data.status === 'update') {
                setLastMessage(event.data.output);
            }
            if (event.data.status === 'complete') {
                setLastMessage(event.data.output);
            }
        }

        worker.current.addEventListener('message', onMessage);

        // Cleanup the worker when the component unmounts
        return () => {
            worker.current.terminate();
            worker.current = null;
        }
    }, [])

    // onClick handler for the "Generate" button to send the input text to the WebWorker
    const generate = () => {
        worker.current.postMessage({
            text: input,

            // numberSteps,
            // numberBeams,
            // lengthPenalty,
            // numReturnSequences,
        });
    }

    return (
        <div>
            <h1>Beam Search Visualization</h1>
            <AppContext.Provider value={initialState}>
                <button onClick={generate}>Generate</button>
                <input value={input} onChange={(e) => setInput(e.target.value)} />
                <div>
                    {lastMessage}
                </div>
                <TreeComponent />
            </AppContext.Provider>
        </div>

    )
}