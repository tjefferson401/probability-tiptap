import { useEffect, useRef, useState } from "react";


export const BeamSearchVis = () => {
    const worker = useRef(null);
    const [lastMessage, setLastMessage] = useState("");
    const [input, setInput] = useState("");

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
          text: input
        });
      }

    return (
        <div>
            <h1>Beam Search Visualization</h1>
            <button onClick={generate}>Generate</button>
            <input value={input} onChange={(e) => setInput(e.target.value)} />
            <div>
                {lastMessage}
            </div>
        </div>
    )
}