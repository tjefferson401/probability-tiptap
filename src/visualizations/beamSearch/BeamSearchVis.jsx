import { useEffect, useRef, useState } from "react";
import TreeComponent from './TreeComponent'
import AppContext, { useAppContext } from './BeamSearchContext'
import ControlPanel from "./ControlPanel";

export const BeamSearchVis = () => {
    // Reference the Webworker that will persist across renders
    const worker = useRef(null);

    // Last message from the WebWorker
    const [lastMessage, setLastMessage] = useState("");

    const initialRenderTree = {
        name: 'root',
        children: []
    };

    {/* Initialize the state for the Beam Search Visualization */}
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
        lastMessage: "",
        isDraggable: false,
        zoom: .75,
        showLogProbs: false,
    });



    {/* Animate's Helper Functions Go Here */}



    /* removeScoresExceptDeepest - Removes scores from all nodes except the deepest nodes in the tree
     * @param {Object} tree - The tree to remove scores from
     * @returns {Object} - The tree with scores removed from all nodes except the deepest nodes
     */
    function removeScoresExceptDeepest(tree) {
        // Initialize the maxDepth variable
        let maxDepth = 0;   



        /* findMaxDepth - Finds the maximum depth of the tree
         * @param {Object} node - The current node
         * @param {Number} depth - The current depth
         * @sideEffects - Updates the maxDepth variable
         */
        function findMaxDepth(node, depth) { 
            if (!node.children || node.children.length === 0) {
                maxDepth = Math.max(maxDepth, depth);
                return;
            }
            node.children.forEach(child => findMaxDepth(child, depth + 1));
        }



        /* traverse - Removes scores from all nodes except the deepest nodes
         * @param {Object} node - The current node
         * @param {Number} depth - The current depth
         * @sideEffects - Removes scores from all nodes except the deepest nodes
         */
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



    /* waitForTimeout - Waits for a specified amount of time
     * @param {Number} timeout - The amount of time to wait in milliseconds
     * @returns {Promise} - A promise that resolves after the specified amount of time
     */
    const waitForTimeout = async (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };



    /* waitForButtonPress - Waits for a button press event
     * @returns {Promise} - A promise that resolves when a button press event is detected
     */
    const waitForButtonPress = () => {
        return new Promise(resolve => {
            const handlePress = () => {
                resolve();
                window.removeEventListener('stepPress', handlePress);
            };
            window.addEventListener('stepPress', handlePress);
        });
    };



    /* highlightNodes - Highlights the nodes in the render tree that match the nodes in the toKeepTemp array
     * @param {Array} toKeepTemp - The array of nodes to highlight
     * @param {Object} renderTree - The render tree to highlight nodes in
     * @param {Function} setRenderTree - The function to update the render tree
     * @sideEffects - Updates the render tree to highlight the nodes in the toKeepTemp array
     */
    const highlightNodes = (toKeepTemp, renderTree, setRenderTree) => {
        let highlightedTree = JSON.parse(JSON.stringify(renderTree));
        


        /* highlight - Recursively highlights the nodes in the render tree that match the nodes in the toKeepTemp array
         * @param {Object} node - The current node
         * @param {Array} nodesToHighlight - The array of nodes to highlight
         * @sideEffects - Updates the highlighted property of the nodes in the render tree
         */
        const highlight = (node, nodesToHighlight) => {
            nodesToHighlight.forEach(n => {
                if (n.name === node.name && n.haveChildren && n.score === node.score) {
                    node.highlighted = true;
                }
            });
            
            if (node.children && Array.isArray(node.children)) {
                node.children.forEach(child => highlight(child, nodesToHighlight));
            }
        };



        /* findLowestScoreLeafNode - Finds the lowest score leaf node in the render tree
         * @param {Object} node - The current node
         * @param {Object} lowestScoreNode - The current lowest score node
         * @returns {Object} - The lowest score leaf node in the render tree
         */
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
    


        /* hasHighlightedNodes - Checks if the render tree has any highlighted nodes
         * @param {Object} node - The current node
         * @returns {Boolean} - True if the render tree has any highlighted nodes, false otherwise
         */
        const hasHighlightedNodes = (node) => {
            if (node.highlighted) {
                return true;
            }
            if (node.children && Array.isArray(node.children)) {
                return node.children.some(child => hasHighlightedNodes(child));
            }
            return false;
        };

        // Ensure children is always an array
        highlightedTree.children = highlightedTree.children || [];
    
        // Highlight the nodes in the toKeepTemp array
        if (Array.isArray(highlightedTree.children)) {
            highlightedTree.children.forEach(child => highlight(child, toKeepTemp));
        } else {
            console.error("highlightedTree.children is not an array");
        }

        // Highlight the lowest score leaf node if no nodes were highlighted; this is a fallback for the last layer
        // where there are no nodes in toKeepTemp
        if (!hasHighlightedNodes(highlightedTree)) {
            const lowestScoreLeafNode = findLowestScoreLeafNode(highlightedTree);
            if (lowestScoreLeafNode) {
                lowestScoreLeafNode.highlighted = true;
            }
        }
        setRenderTree(highlightedTree);
    };



    /* removeHighlight - Removes the highlight from all nodes in the render tree
     * @param {Object} renderTree - The render tree to remove the highlight from
     * @param {Function} setRenderTree - The function to update the render tree
     * @sideEffects - Updates the render tree to remove the highlight from all nodes
     */
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


    /* animate - Recursively visualizes the beam search algorithm in steps or all at once
     * @param {Array} layer - The current layer of beams
     * @param {Number} depth - The current depth of the tree
     * @sideEffects - Updates the render tree to visualize the beam search algorithm
     * @sideEffects - Waits for a button press or a timeout to continue the animation
     */
    const animate = async (layer, depth = 0) => {
            try {

                // If we are at the beginning of the animation, reset the render tree
                if (depth === 0) {
                    setConfig(prevConfig => ({ ...prevConfig, renderTree: initialRenderTree }));
                    layer = [...JSON.parse(JSON.stringify(config.tree)).children]

                    // Create the root node
                    let root = {
                        name: layer[0].name,
                        sequence: layer[0].name,
                        children: []
                    }

                    // Create the updated tree with the root node
                    let updatedTree = {
                        ...config.renderTree,
                        children: [root],
                        highlighted: false
                    }

                    setConfig(prevConfig => ({ ...prevConfig, renderTree: updatedTree }));

                }

                // Update the current layer and depth in the config
                setConfig(prevConfig => ({
                    ...prevConfig,
                    currentLayer: layer,
                    currentDepth: depth
                }))

                // Show the animate button
                if (!config.useTimeout) {
                    setConfig(prevConfig => ({ ...prevConfig, showAnimateButton: true }));
                }

                // Wait for a button press or a timeout to continue the animation; visualizing the beams in the current layer
                if (config.useTimeout) {
                    await waitForTimeout(2000);

                } else {
                    await waitForButtonPress();
                }

                // Prevent the showAnimateButton from showing again; prepare to visualize the candidates of each beam
                setConfig(prevConfig => ({ ...prevConfig, showAnimateButton: false }));



                {/* Visualize the candidates of each beam in the current layer */}
                let beams = []
                for (let beam of layer) {
                    let candidates  = []
                    
                    // Add each candidate to the candidates array
                    for (let child of beam.children) {
                        let candidate = {
                            name: child.token,
                            score: child.score,
                            rank: child.rank,
                            children: [],
                            highlighted: false,
                        }

                        candidates.push(candidate)
                    }

                    // Add each beam full of candiates to the beams array
                    beams.push({
                        name: depth === 0 ? beam.name : beam.sequence,
                        children: candidates,
                        highlighted: false
                    })
                }

                // Update the render tree with the beams
                let updatedTree = {
                    ...config.renderTree,
                    children: beams,
                    highlighted: false
                }

                setConfig(prevConfig => ({ ...prevConfig, renderTree: updatedTree }));

                // Wait for a button press or a timeout to continue the animation; Now it is time to prune and pick off 
                // candidates for the new beams
                if (config.useTimeout) {
                    await waitForTimeout(2000);
                } else {
                    await waitForButtonPress();
                }



                {/*Prepare to Prune and Pick the New Beams*/}
                let toKeep = []
                let toKeepTemp = []
                let stage = layer

                // Keeping track of all children for when we render the deepest layer of the tree
                let allChildren = []
                let beamChildren = []
                let numEmptyBeams = 0

                // Look at each child for each of the baems
                for (let beam of stage) {
                    for (let child of beam.children) {
                        allChildren.push(child)
                        child.highlighted = false

                        // If the child has children, we need to keep it for the next layer
                        if (child.children?.length > 0) {
                            // need a copy of the whole tree to pass to the next layer recursively
                            toKeep.push(JSON.parse(JSON.stringify(child)))

                            // this is for temporarily rendering one layer at a time
                            let candidateBeamChildren = {
                                name: child.token,
                                children: [],
                                haveChildren: true,
                                highlighted: false,
                            }


                            let candidate = {
                                name: child.sequence,
                                children: [],
                                haveChildren: true,
                                highlighted: false,
                            }
                                                            
                            toKeepTemp.push(candidate)
                            beamChildren.push(candidateBeamChildren)
                        }
  
                    }

                    // If the beam has no children, aggregate how many empty beams we have
                    if (beamChildren.length === 0) {
                        numEmptyBeams += 1
                    }
                    
                    // add beamChildren array to beam.children
                    beam.children = beamChildren  
                }

                // Gone through all the beams, all are empty, we are at the deepest layer
                if (stage.length === numEmptyBeams) {
                    let childArray = []
                    let lowestChild = null

                    // Go through all the Children and find the one with the lowest score
                    for (let child of allChildren) {
                        if (!lowestChild || Math.abs(child.score) < Math.abs(lowestChild.score)) {
                            lowestChild = child
                        }
                    }
                    childArray.push(lowestChild)

                    toKeepTemp = childArray
                    beamChildren = childArray

                    // Update the names of the children to be the sequence -- this allows us to make the name the full phrase instead
                    // of just the token
                    for (let child of toKeepTemp) {
                        child.name = child.sequence
                        child.haveChildren = true
                        child.highlighted = false
                    }
                }

                // Highlight the nodes in beamChildren, indicating which nodes are being kept for the next layer
                highlightNodes(beamChildren, updatedTree, (newTree) => {
                    setConfig(prevConfig => ({ ...prevConfig, renderTree: newTree }));
                });

                // Wait for a button press or a timeout to continue the animation
                if (config.useTimeout) {
                    await waitForTimeout(2000);
                } else {
                    await waitForButtonPress();
                }



                {/* Recurse to the next layer/ Finish the animation */}
                updatedTree = {
                    ...config.renderTree,
                    children: toKeepTemp
                }

                // Update the render tree with the nodes that are being kept for the next layer
                setConfig(prevConfig => ({ ...prevConfig, renderTree: updatedTree }));

                // If there are nodes to keep, recurse to the next layer
                if (toKeep.length > 0) {

                    // Remove the Highlight from the nodes in the render tree, recurse to the next layer
                    removeHighlight(updatedTree, (newTree) => {
                        setConfig(prevConfig => ({ ...prevConfig, renderTree: newTree }));
                    });

                    setTimeout(() => {
                        animate(JSON.parse(JSON.stringify(toKeep)), depth + 1);
                    }, 0);

                } else {
                    
                    // We have finished the animation; remove the scores from all nodes except the deepest nodes; and render the full tree
                    // Force a re-render w/ Timeout
                    setTimeout(() => {}, 0);
                 
                    // Enable the resetButton, disable the stepButton, and enable dragging
                    setConfig(prevConfig => ({
                        ...prevConfig,
                        renderTree: removeScoresExceptDeepest(JSON.parse(JSON.stringify(config.tree))),
                        isStepDisabled: true,
                        showResetButton: true,
                        isDraggable: true,
                    }));
                }
                
                // If we are at the end of the animation, disable the animate button
                setConfig(prevConfig => ({
                    ...prevConfig,
                    showAnimateButton: false
                }));
            
            } catch (error) {
                console.error('Error during animation:', error);
            }
        }

    useEffect(() => {
        // Continue the animation with the updated useTimeout state from the current state if we press the animate button!
        if (config.useTimeout && config.isRunning) {
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
                setLastMessage(event.data.sequence);
            }

            if (event.data.status === 'complete') {
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
                <ControlPanel 
                    style={{ 
                        width: '20%', 
                        backgroundColor: 'blue', 
                        color: 'white', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center', 
                        alignItems: 'center' 
                    }}>
                </ControlPanel>

                <div style={{ flex: 1, backgroundColor: 'lightgray' }}>
                    <TreeComponent />
                </div>
                
            </AppContext.Provider>
        </div>
    )
}
