import { useEffect, useRef, useState } from "react";
import TreeComponent from './TreeComponent'
import AppContext, { useAppContext } from './BeamSearchContext'
import ControlPanel from "./ControlPanel";
import { DepthEstimationPipeline } from "@xenova/transformers";

export const BeamSearchVis = () => {
    const worker = useRef(null);                            // reference to the WebWorker that persists across renders
    const [lastMessage, setLastMessage] = useState("");     // the last partial sequence received from the WebWorker
    // const [input, setInput] = useState("");                 // text the user inputs from which the model generates beams
    
    // const initialTreeData = {
    //     name: 'root',
    //     children: [
    //         {
    //             name: 'Hello my name is Hello my name is Hello my name is Hello my name is Hello my name is Hello my name is Hello my name is Hello my name is Hello my name is Hello my name is ',
    //             children: [
    //                 {
    //                     name: 'Justin',
    //                     score: 0.10,
    //                     children: [
    //                         {
    //                             name: '.',
    //                             score: 0.008,
    //                             children: []
    //                         },

    //                         {
    //                             name: '-',
    //                             score: 0.065,
    //                             children: []
    //                         },

    //                         {
    //                             name: ',',
    //                             score: 0.035,
    //                             children: [
    //                                 {
    //                                     name: '!',
    //                                     score: 0.002,
    //                                     children: []
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     name: 'Adam',
    //                     score: 0.01,
    //                     children: [
    //                         {
    //                             name: '.',
    //                             score: 0.073,
    //                             children: [
    //                                 {
    //                                     name: '!',
    //                                     score: 0.002,
    //                                     children: []
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             name: ',',
    //                             score: 0.015,
    //                             children: []
    //                         },
    //                         {
    //                             name: '+',
    //                             score: 0.045,
    //                             children: []
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     name: ',',
    //                     score: 0.025,
    //                     children: []
    //                 },
    //                 {
    //                     name: ',',
    //                     score: 0.055,
    //                     children: []
    //                 }
    //             ]
    //         }
    //     ]
    // }

    const initialRenderTree = {
        name: 'root',
        children: []
    };

    const [config, setConfig] = useState({
        tree: null,
        useTimeout: false,
        isRunning: false,
        currentLayer: [],
        currentDepth: 0,
        showAnimateButton: false,
        showResetButton: false,
        isStepDisabled: false,
        renderTree: initialRenderTree,
        numBeams: 2,
        maxDepth: 2,
        input: "",
        lastMessage: ""
    });

    {/* Animate Logic + Animate Helper Functions Go Here!*/}
    function removeScoresExceptDeepest(tree) {
        let maxDepth = 0;   

        function findMaxDepth(node, depth) { 
            if (!node.children || node.children.length === 0) {
                maxDepth = Math.max(maxDepth, depth);
                return;
            }
            node.children.forEach(child => findMaxDepth(child, depth + 1));
        }

        function traverse(node, depth) {
            if (depth < maxDepth) {
                delete node.score
            }
            if (node.children) {
                node.children.forEach(child => traverse(child, depth + 1));
            }
        }

        findMaxDepth(tree, 0);
        traverse(tree, 0)
        return tree;
    }

    const waitForTimeout = async (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    const waitForButtonPress = () => {
        return new Promise(resolve => {
            const handlePress = () => {
                resolve();
                window.removeEventListener('stepPress', handlePress);
            };
            window.addEventListener('stepPress', handlePress);
        });
    };

    const highlightNodes = (toKeepTemp, renderTree, setRenderTree) => {
        let highlightedTree = JSON.parse(JSON.stringify(renderTree));

        console.log("toKeepTemp:", toKeepTemp);
        
        const highlight = (node, nodesToHighlight) => {
            nodesToHighlight.forEach(n => {
                console.log("Node:", node, "Node's sequence:", node.sequence);
                console.log("N to highlight:", n, "N to Highlight's sequence:", n.sequence);
                console.log("Does node have children?", n.haveChildren, "Comparing Names:", n.name === node.name, "Comparing Scores:", n.score === node.score);

                if (n.name === node.name && n.haveChildren && n.score === node.score) {
                    node.highlighted = true;
                    console.log(`Highlighted node: ${node.name} with score: ${node.score}`);
                }
            });
            
            if (node.children && Array.isArray(node.children)) {
                node.children.forEach(child => highlight(child, nodesToHighlight));
            }
        };

        const findLowestScoreLeafNode = (node, lowestScoreNode = null) => {
            if (!node.children || node.children.length === 0) {
                // It's a leaf node
                if (!lowestScoreNode || Math.abs(node.score) < Math.abs(lowestScoreNode.score)) {
                    lowestScoreNode = node;
                }
            } else {
                node.children.forEach(child => {
                    lowestScoreNode = findLowestScoreLeafNode(child, lowestScoreNode);
                });
            }
            return lowestScoreNode;
        };
    
        const hasHighlightedNodes = (node) => {
            if (node.highlighted) {
                return true;
            }
            if (node.children && Array.isArray(node.children)) {
                return node.children.some(child => hasHighlightedNodes(child));
            }
            return false;
        };

        console.log("Initial Render Tree:", JSON.stringify(renderTree, null, 2));
        console.log("Nodes to Highlight (toKeepTemp):", JSON.stringify(toKeepTemp, null, 2));

        // Ensure children is always an array
        highlightedTree.children = highlightedTree.children || [];
    
        if (Array.isArray(highlightedTree.children)) {
            highlightedTree.children.forEach(child => highlight(child, toKeepTemp));
        } else {
            console.error("highlightedTree.children is not an array");
        }

        if (!hasHighlightedNodes(highlightedTree)) {
            const lowestScoreLeafNode = findLowestScoreLeafNode(highlightedTree);
            if (lowestScoreLeafNode) {
                lowestScoreLeafNode.highlighted = true;
                console.log(`Highlighted leaf node with lowest score: ${lowestScoreLeafNode.name} with score: ${lowestScoreLeafNode.score}`);
            }
        }

        setRenderTree(highlightedTree);
    };

    const removeHighlight = (renderTree, setRenderTree) => {
        let unhighlightedTree = JSON.parse(JSON.stringify(renderTree));
        const unhighlight = (node) => {
            node.highlighted = false;
            if (node.children) {
                node.children.forEach(child => unhighlight(child));
            }
        };
        unhighlightedTree.children.forEach(child => unhighlight(child));
        setRenderTree(unhighlightedTree);
    };

    // Add a timeout to highlight nodes before pruning
    const animate = async (layer, depth = 0) => {

            try {
                console.log("NEW RECURSIVE CALL!!!!!!!!!!!!!!!!")

                console.log("THIS IS THE TREE!", config.tree)

                if (depth === 0) {
                    layer = [...JSON.parse(JSON.stringify(config.tree)).children]

                    console.log("Layer", layer[0])
                    let root = {
                        name: layer[0].name,
                        sequence: layer[0].name,
                        children: []
                    }

                    let updatedTree = {
                        ...config.renderTree,
                        children: [root],
                        highlighted: false
                    }

                    setConfig(prevConfig => ({ ...prevConfig, renderTree: updatedTree }));

                } else {
                    console.log("Layer at beginning of recursive function:", layer)
                }

                setConfig(prevConfig => ({
                    ...prevConfig,
                    currentLayer: layer,
                    currentDepth: depth
                }))

                if (!config.useTimeout) {
                    setConfig(prevConfig => ({ ...prevConfig, showAnimateButton: true }));

                    // setTimeout(() => {
                    //     setConfig(prevConfig => ({ ...prevConfig, showAnimateButton: true }));
                    // }, 0);
                }

                if (config.useTimeout) {
                    await waitForTimeout(2000);
                } else {
                    console.log("Waiting for button press...");
                    await waitForButtonPress();
                }

                setConfig(prevConfig => ({ ...prevConfig, showAnimateButton: false }));

                let beams = []
                for (let beam of layer) {
                    console.log("Beam in the layer", beam)
                    console.log("Beam Children", beam.children)

                    let candidates  = []
                    for (let child of beam.children) {
                        console.log("Child of Beam.children in the adding step", child)
                        let candidate = {
                            name: child.token,
                            score: child.score,
                            children: [],
                            highlighted: false,
                        }
                        console.log("Candidate:", candidate)
                        candidates.push(candidate)
                    }

                    console.log("Candidates after we add all of them!", candidates)

                    beams.push({
                        name: depth === 0 ? beam.name : beam.sequence,
                        children: candidates,
                        highlighted: false
                    })

                    console.log("Beams after push", beams)
                }

                console.log("Beams", beams)

                let updatedTree = {
                    ...config.renderTree,
                    children: beams,
                    highlighted: false
                }

                setConfig(prevConfig => ({ ...prevConfig, renderTree: updatedTree }));
                console.log("Logging the layer parameter after visualizing the candidates", layer)

                // Prune and Pick the new Beams
                if (config.useTimeout) {
                    await waitForTimeout(2000);
                } else {
                    console.log("Waiting for button press...");
                    await waitForButtonPress();
                }

                // look two ahead
                let toKeep = []
                let toKeepTemp = []
                let stage = layer
                let allChildren = []
                let beamChildren = []
                let numEmptyBeams = 0

                console.log("Layer before the prune step", layer)

                for (let beam of stage) {
                    console.log("Beam", beam)

                    for (let child of beam.children) {
                        allChildren.push(child)
                        child.highlighted = false
                        console.log("Child of Beam.children in the pruning step", child)
                        if (child.children?.length > 0) {
                            // need a copy of the whole tree to pass to the next layer
                            toKeep.push(JSON.parse(JSON.stringify(child)))
                            console.log("To Keep Array", toKeep)
                            console.log(child.token)
                            // this is for temporarily rendering one layer at a time
                            let candidateBeamChildren = {
                                name: child.token,
                                score: child.score,
                                children: [],
                                haveChildren: true,
                                highlighted: false,
                            }

                            let candidate = {
                                name: child.sequence,
                                score: child.score,
                                children: [],
                                haveChildren: true,
                                highlighted: false,
                            }
                                                            
                            toKeepTemp.push(candidate)
                            beamChildren.push(candidateBeamChildren)
                        }
                        console.log("Beam Children", beamChildren)
                    }

                    if (beamChildren.length === 0) {
                        numEmptyBeams += 1
                    }
                    
                    console.log("Final Beam Children", beamChildren)
                    beam.children = beamChildren
                    console.log("After we add beamChildren array to beam.children", beam.children)   
                }

                if (stage.length === numEmptyBeams) {
                    let childArray = []
                    let lowestChild = null
                    for (let child of allChildren) {
                        if (!lowestChild || Math.abs(child.score) < Math.abs(lowestChild.score)) {
                            lowestChild = child
                        }
                    }
                    childArray.push(lowestChild)

                    toKeepTemp = childArray
                    beamChildren = childArray

                    for (let child of toKeepTemp) {
                        child.name = child.sequence
                        child.haveChildren = true
                        child.highlighted = false
                    }
                }

                console.log("TO KEEP TEMP BEFORE WE CALL HIGHLIGHT NODES", toKeepTemp)
                console.log("BEAM CHILDREN", beamChildren)

                highlightNodes(beamChildren, updatedTree, (newTree) => {
                    setConfig(prevConfig => ({ ...prevConfig, renderTree: newTree }));
                });

                if (config.useTimeout) {
                    await waitForTimeout(2000);
                } else {
                    console.log("Waiting for button press...");
                    await waitForButtonPress();
                }

                console.log("To Keep for Next Stack Frame", depth, toKeep)
                console.log("To Keep Temp", depth, toKeepTemp)

                updatedTree = {
                    ...config.renderTree,
                    children: toKeepTemp
                }
                console.log(updatedTree)

                setConfig(prevConfig => ({ ...prevConfig, renderTree: updatedTree }));

                if (toKeep.length > 0) {
                    console.log("This is the toKeep array", toKeep)
                    console.log("Recursing, this is what we are passing into layer!", JSON.parse(JSON.stringify(toKeep)))

                    removeHighlight(updatedTree, (newTree) => {
                        setConfig(prevConfig => ({ ...prevConfig, renderTree: newTree }));
                    });

                    setTimeout(() => {
                        animate(JSON.parse(JSON.stringify(toKeep)), depth + 1);
                    }, 0);

                } else {
                    console.log("Finished!")
                    console.log("Final Tree", JSON.parse(JSON.stringify(config.tree)))
                    let treeWithoutScores = removeScoresExceptDeepest(JSON.parse(JSON.stringify(config.tree)))
                    
                    setConfig(prevConfig => ({
                        ...prevConfig,
                        renderTree: treeWithoutScores,
                        isStepDisabled: true,
                        showResetButton: true
                    }));
                }
                
                setConfig(prevConfig => ({
                    ...prevConfig,
                    showAnimateButton: false
                }));
            
            } catch (error) {
                console.error('Error during animation:', error);
            }
        }

    useEffect(() => {
        if (config.useTimeout && config.isRunning) {
            // Continue the animation with the updated useTimeout state from the current state
            animate(config.currentLayer, config.currentDepth);
        }
    }, [config.useTimeout, config.isRunning]);



    {/* WebWorker Logic Goes Here!*/}
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
                setLastMessage(event.data.sequence);
            }

            if (event.data.status === 'complete') {
                console.log("Complete Output:", event.data.output);
                setLastMessage(event.data.sequence);
                setConfig((prevConfig) => ({
                    ...prevConfig,
                    tree: event.data.output
                }));
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
    const generate = async () => {
        await waitForTimeout(0);
        console.log("This is what tree looks like: ", config.tree)
        console.log("This is what we are sending to the worker: ", config.input, config.numBeams, config.maxDepth)
        worker.current.postMessage({
            text: config.input,
            numBeams: config.numBeams,
            maxDepth: config.maxDepth
        });
    }


    {/* This is what we are Passing Into Context!*/}
    const initialState = { 
        config,
        setConfig,
        animate,
        generate,
        lastMessage
    };

    return (

        <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
            <AppContext.Provider value={initialState}>
                <ControlPanel style={{ width: '20%', backgroundColor: 'blue', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    {/* <div>{lastMessage}</div> */}
                </ControlPanel>
                <div style={{ flex: 1, backgroundColor: 'white' }}>
                    <TreeComponent />
                </div>
            </AppContext.Provider>
        </div>
    )
}
