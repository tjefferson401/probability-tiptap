import { useEffect, useRef, useState } from "react";
import { Slider, TextField, Button } from '@mui/material';
import Markdown from 'markdown-to-jsx';

import TreeComponent from './TreeComponent'
import AppContext from './BeamSearchContext'




export const BeamSearchVis = () => {

    const worker = useRef(null);
    const [lastMessage, setLastMessage] = useState("");
    const [input, setInput] = useState("");
    // const [numberSteps, setNumberSteps] = useState(5);
    // const [numberBeams, setNumberBeams] = useState(4);
    // const [lengthPenalty, setLengthPenalty] = useState(1.0);
    // const [numReturnSequences, setNumReturnSequences] = useState(3);
    // const [output, setOutput] = useState({ html: "", markdown: "" });

    useEffect(() => {
        if (worker.current === null) {
            worker.current = new Worker(new URL('./beamSearchWorker.js', import.meta.url), { type: 'module' });
        }

        const onMessage = (event) => {
            if (event.data.status === 'update') {
                setLastMessage(event.data.output);
            }
            if (event.data.status === 'complete') {
                setLastMessage(event.data.output);
            }
        }

        worker.current.addEventListener('message', onMessage);

        return () => {
            worker.current.terminate();
            worker.current = null;
        }
    }, [])

    const generate = () => {
        worker.current.postMessage({
            text: input,

            // numberSteps,
            // numberBeams,
            // lengthPenalty,
            // numReturnSequences,
        });
    }

    const initialTreeData = {
        name: 'root',
        children: []
    };

    const [tree, setTree] = useState(initialTreeData);

    const initialState = {
      tree,
      setTree
    };
    


    return (

        <div>
            <h1>Beam Search Visualization</h1>
            <AppContext.Provider value = {initialState}>
                {/* <button onClick={generate}>Generate</button>
                <input value={input} onChange={(e) => setInput(e.target.value)} />
                <div>
                    {lastMessage}
                </div> */}
                <TreeComponent />
            </AppContext.Provider>
        </div>

    )
}