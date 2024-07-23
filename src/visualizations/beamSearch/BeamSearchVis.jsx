import { useEffect, useRef, useState } from "react";
import { Slider, TextField, Button } from '@mui/material';
import Markdown from 'markdown-to-jsx';

import TreeComponent from './TreeComponent'
import AppContext, { useAppContext } from './BeamSearchContext'

export const BeamSearchVis = () => {
    const worker = useRef(null);                            // reference to the WebWorker that persists across renders
    const [lastMessage, setLastMessage] = useState("");     // the last partial sequence received from the WebWorker
    const [input, setInput] = useState("");                 // text the user inputs from which the model generates beams
    
    const initialTreeData = {
        name: 'root',
        children: [
            {
                name: 'Hello my name is Hello my name is Hello my name is Hello my name is Hello my name is Hello my name is Hello my name is Hello my name is Hello my name is Hello my name is ',
                children: [
                    {
                        name: 'Justin',
                        score: 0.10,
                        children: [
                            {
                                name: '.',
                                score: 0.008,
                                children: []
                            },

                            {
                                name: '-',
                                score: 0.065,
                                children: []
                            },

                            {
                                name: ',',
                                score: 0.035,
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
                                score: 0.073,
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
                            },
                            {
                                name: '+',
                                score: 0.045,
                                children: []
                            }
                        ]
                    },
                    {
                        name: ',',
                        score: 0.025,
                        children: []
                    },
                    {
                        name: ',',
                        score: 0.055,
                        children: []
                    }
                ]
            }
        ]
    }
    
    const [config, setConfig] = useState({});
    const [tree, setTree] = useState(initialTreeData);// the tree data that the d3-tree component renders
    const initialState = {                                  // package the tree and setTree functions into an object to pass to the context
        tree,
        setTree,
    };

    const findChildren = (children, older_token_sequence) => {
        console.log("Children", children)
        console.log("Finding Children for", older_token_sequence)
        const foundChildren = [];
        children.forEach(child => {
            console.log("Checking against", child.output_token_ids.slice(0, -1))
            if (older_token_sequence.every((token, index) => token === child.output_token_ids.slice(0, -1)[index])) {
                foundChildren.push(child);
            }
        });
        console.log("Found Children", foundChildren)
        return foundChildren;
    };

    const buildTree = (steps) => {
        let children = [];
        let newChildren = [];
        const reversedSteps = [...steps].reverse();
        reversedSteps.forEach((step, index) => {
            console.log("Current Step", step)
            newChildren = [];
            console.log("Starting a new round of children")
            step.forEach(beam => {
                for (let i = 0; i < beam.top_tokens.length; i++) {
                    console.log("Pushing", beam.top_tokens_decoded[i])
                    newChildren.push({
                        name: beam.top_tokens_decoded[i],
                        output_token_ids: beam.output_token_ids,
                        score: beam.probabilities[i],
                        children: findChildren(children, beam.output_token_ids),
                    });
                };
            });
            console.log("NEW CHILDREN", newChildren);
            children = newChildren;
        });
        return {
            name: 'root',
            children: [{
                name: input,
                children: children
            }]
        };
    };

    // Create a new WebWorker when the component mounts
    useEffect(() => {
        // Create a new WebWorker if one does not already exist
        if (worker.current === null) {
            worker.current = new Worker(new URL('./beamSearchWorker.js', import.meta.url), { type: 'module' });
        }

        // When the worker returns an output, update the lastMessage to be the "most likely" sequence at that point
        const onMessage = (event) => {
            if (event.data.status === 'update') {
                console.log("Update Output:", event.data.output);
            }
            if (event.data.status === 'complete') {
                console.log("Complete Output:", event.data.output);
                //setLastMessage(event.data.output[0][0].output_sequence);
                setTree(event.data.output);
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
            {/* <h1>Beam Search Visualization</h1> */}
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
