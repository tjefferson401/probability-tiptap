import { useEffect, useRef, useState } from "react";
import { Slider, TextField, Button } from '@mui/material';
import Markdown from 'markdown-to-jsx';


export const BeamSearchVis = () => {

    const worker = useRef(null);
    const [lastMessage, setLastMessage] = useState("");
    const [input, setInput] = useState("");
    const [numberSteps, setNumberSteps] = useState(5);
    const [numberBeams, setNumberBeams] = useState(4);
    const [lengthPenalty, setLengthPenalty] = useState(1.0);
    const [numReturnSequences, setNumReturnSequences] = useState(3);
    const [output, setOutput] = useState({ html: "", markdown: "" });

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

    return (

        // <div>
        //     <h1>Beam Search Visualizer</h1>
        //     <p>Play with the parameters below to understand how beam search decoding works! Here's GPT2 doing beam search decoding for you.</p>
        //     <TextField label="Sentence to decode from" value={input} onChange={(e) => setInput(e.target.value)} fullWidth />
        //     <Slider
        //         value={numberSteps}
        //         min={1}
        //         max={12}
        //         step={1}
        //         onChange={(e, val) => setNumberSteps(val)}
        //         valueLabelDisplay="auto"
        //         aria-labelledby="number-steps-slider"
        //     />
        //     <Slider
        //         value={numberBeams}
        //         min={1}
        //         max={4}
        //         step={1}
        //         onChange={(e, val) => setNumberBeams(val)}
        //         valueLabelDisplay="auto"
        //         aria-labelledby="number-beams-slider"
        //     />
        //     <Slider
        //         value={lengthPenalty}
        //         min={-3}
        //         max={3}
        //         step={0.5}
        //         onChange={(e, val) => setLengthPenalty(val)}
        //         valueLabelDisplay="auto"
        //         aria-labelledby="length-penalty-slider"
        //     />
        //     <Slider
        //         value={numReturnSequences}
        //         min={1}
        //         max={4}
        //         step={1}
        //         onChange={(e, val) => setNumReturnSequences(val)}
        //         valueLabelDisplay="auto"
        //         aria-labelledby="num-return-sequences-slider"
        //     />
        //     <Button onClick={generate}>Generate</Button>

        //     <div dangerouslySetInnerHTML={{ __html: output.html }} />
        //     <Markdown>{output.markdown}</Markdown>
        // </div>

        // <div>
        // <h1>Beam Search Visualizer</h1>
        // <p>Play with the parameters below to understand how beam search decoding works! Here's GPT2 doing beam search decoding for you.</p>
        // <TextField label="Sentence to decode from" value={input} onChange={(e) => setInput(e.target.value)} fullWidth />
        // <Slider label="Number of steps" min={1} max={12} step={1} value={numberSteps} onChange={(e, val) => setNumberSteps(val)} />
        // <Slider label="Number of beams" min={1} max={4} step={1} value={numberBeams} onChange={(e, val) => setNumberBeams(val)} />
        // <Slider label="Length penalty" min={-3} max={3} step={0.5} value={lengthPenalty} onChange={(e, val) => setLengthPenalty(val)} />
        // <Slider label="Number of return sequences" min={1} max={4} step={1} value={numReturnSequences} onChange={(e, val) => setNumReturnSequences(val)} />
        // <Button onClick={generate}>Generate</Button>
        // <div dangerouslySetInnerHTML={{ __html: output.html }} />
        // <Markdown>{output.markdown}</Markdown>
        // </div>

        <div>
            <h1>Beam Search Visualization</h1>
            <button onClick={generate}>Generate</button>
            <input value={input} onChange={(e) => setInput(e.target.value)} />
            <div>
                {lastMessage}
            </div>
        </div>

        // <div>
        // <h1>Beam Search Visualizer</h1>
        // <p>Play with the parameters below to understand how beam search decoding works! Here's GPT2 doing beam search decoding for you.</p>
        // {/* <TextField label="Sentence to decode from" value={inputText} onChange={(e) => setInputText(e.target.value)} fullWidth /> */}
        // <Slider label="Number of steps" min={1} max={12} step={1} value={null} onChange={(e, val) => setNumberSteps(val)} />
        // <Slider label="Number of beams" min={1} max={4} step={1} value={null} onChange={(e, val) => setNumberBeams(val)} />
        // <Slider label="Length penalty" min={-3} max={3} step={0.5} value={null} onChange={(e, val) => setLengthPenalty(val)} />
        // <Slider label="Number of return sequences" min={1} max={4} step={1} value={null} onChange={(e, val) => setNumReturnSequences(val)} />
        // <Button onClick={generate}>Generate</Button>
        // <input value={input} onChange={(e) => setInput(e.target.value)} />
        // <div>
        //     {lastMessage}
        // </div>

        // </div>
    )
}