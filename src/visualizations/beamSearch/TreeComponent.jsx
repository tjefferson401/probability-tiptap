import React, { useState, useEffect, useRef, useContext } from 'react';
import Tree from 'react-d3-tree';
import { useAppContext } from './BeamSearchContext';
import CustomNodeRender from './CustomNode';

const TreeComponent = () => {
    const { tree, config, setConfig } = useAppContext();   // consume the tree state and setTree function from the context

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth, 
        height: window.innerHeight 
    });

    const [renderTree, setRenderTree] = useState({
        name: 'root',
        children: []
    });

    const translate = {
        x: dimensions.width / 32,  // Adjusted for better positioning
        y: dimensions.height / 2.25   // Adjusted for better positioning
    };


    const [useTimeout, setUseTimeout] = useState(false); // true for timeout, false for button press
    const [isRunning, setIsRunning] = useState(false);
    const [shouldSwitchToTimeout, setShouldSwitchToTimeout] = useState(false);
    const [currentLayer, setCurrentLayer] = useState([]);
    const [currentDepth, setCurrentDepth] = useState(0);
    const animateRef = useRef(null);

    const startStepping = () => {
        setUseTimeout(false);
        setIsRunning(true);
        animate([], 0); // Pass initial parameters for your animation
    };

    const startAnimating = () => {
        setShouldSwitchToTimeout(true);
        if (!isRunning) {
            setIsRunning(true);
            animate([], 0); // Pass initial parameters for your animation
        }
    };

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


    const animate = async (layer, depth = 0) => {
        animateRef.current = async (layer, depth) => {
            try {
                console.log("NEW RECURSIVE CALL!!!!!!!")
                console.log('Animating at depth:', depth);

            
                if (depth === 0) {
                    layer = [...JSON.parse(JSON.stringify(tree)).children]
                    console.log("Layer at beginning of recursive function in the Base:", layer)

                    let root = {
                        name: layer[0].name,
                        children: []
                    }

                    let updatedTree = {
                        ...renderTree,
                        children: [root]
                    }

                    setRenderTree(updatedTree)

                } else {
                    console.log("Layer at beginning of recursive function:", layer)
                }

                if (shouldSwitchToTimeout) {
                    setUseTimeout(true);
                    setShouldSwitchToTimeout(false);
                }
                
                setCurrentLayer(layer);
                setCurrentDepth(depth);

                if (useTimeout) {
                    await waitForTimeout(2000);
                } else {
                    console.log("Waiting for button press...");
                    await waitForButtonPress();
                }

                let beams = []
                for (let beam of layer) {
                    console.log("Beam in the layer", beam)
                    console.log("Beam Children", beam.children)

                    let candidates  = []
                    for (let child of beam.children) {
                        console.log("Child of Beam.children in the adding step", child)
                        let candidate = {
                            name: child.name,
                            score: child.score,
                            children: []
                        }
                        console.log("Candidate:", candidate)
                        candidates.push(candidate)
                    }

                    console.log("Candidates after we add all of them!", candidates)

                    beams.push({
                        name: beam.name,
                        children: candidates
                    })

                    console.log("Beams after push", beams)
                }

                console.log("Beams", beams) 

                let updatedTree = {
                    ...renderTree,
                    children: beams
                }

                setRenderTree(updatedTree)  

                console.log("Logging the layer parameter after visualizing the candidates", layer)

                // Prune and Pick the new Beams
                if (useTimeout) {
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
                let emptyBeams = 0

                console.log("Layer before the prune step", layer)

                for (let beam of stage) {
                    console.log("Beam", beam)
                    let beamChildren = []

                    for (let child of beam.children) {
                        allChildren.push(child)
                        console.log("Child of Beam.children in the pruning step", child)
                        if (child.children.length > 0) {
                            // need a copy of the whole tree to pass to the next layer
                            toKeep.push(JSON.parse(JSON.stringify(child)))
                            console.log("To Keep Array", toKeep)

                            // this is for temporarily rendering one layer at a time
                            let candidate = {
                                name: child.name,
                                score: child.score,
                                children: []
                            }
                                                            
                            toKeepTemp.push(candidate)
                            beamChildren.push(candidate)

                        } 
                        console.log("Beam Children", beamChildren)
                    }

                    if (beamChildren.length === 0) {
                        emptyBeams += 1
                    }
                    
                    console.log("Final Beam Children", beamChildren)
                    beam.children = beamChildren
                    console.log("After we add beamChildren array to beam.children", beam.children)   
                }

                console.log(stage.length)
                if (stage.length != emptyBeams) {

                    console.log("Updated Stage", stage)
                    updatedTree = {
                        ...renderTree,
                        children: stage
                    }   

                } else {
                    console.log("WE HAVE NO MORE BEAMS TO KEEP AND HAVE REACHED THE END OF RENDERING")
                    updatedTree = {
                        ...renderTree,
                        children: allChildren
                    }
                }

                console.log("This is what we update our tree with after we pruned!", stage)
                setRenderTree(updatedTree)

                if (useTimeout) {
                    await waitForTimeout(2000);
                } else {
                    console.log("Waiting for button press...");
                    await waitForButtonPress();
                }

                console.log("To Keep for Next Iteration", depth, toKeep)
                console.log("To Keep Temp", depth, toKeepTemp)

                updatedTree = {
                    ...renderTree,
                    children: toKeepTemp
                }
                console.log(updatedTree)
                setRenderTree(updatedTree)

                // Recursive Case; If no more children to keep, then render the whiole tree
                if (toKeep.length > 0) {
                    console.log("This is the toKeep array", toKeep)
                    console.log("Recursing, this is what we are passing into layer!", JSON.parse(JSON.stringify(toKeep)))
                    animate(JSON.parse(JSON.stringify(toKeep)), depth + 1);

                } else {
                    console.log("Finished!")
                    console.log("Final Tree", JSON.parse(JSON.stringify(tree)))
                    setRenderTree([JSON.parse(JSON.stringify(tree))])
                }
            
            } catch (error) {
                console.error('Error during animation:', error);
            }
        }
        animateRef.current(layer, depth);
    }

    useEffect(() => {
        if (shouldSwitchToTimeout) {
            setShouldSwitchToTimeout(false);
            setUseTimeout(true);
            // Continue the animation with the updated useTimeout state from the current state
            animateRef.current(currentLayer, currentDepth);
        }
    }, [shouldSwitchToTimeout, currentLayer, currentDepth]);

    return (
        <div style={{display: 'flex', height: '100vh', width: '100vw'}}>
            <div style ={{width: '20%'}}>
            <button onClick={startStepping}>Start</button>
                <button onClick={startAnimating}>Animate</button>
                <button onClick={() => window.dispatchEvent(new CustomEvent('stepPress'))}>
                    Step
                </button>

            </div>
            <div style={{ width: '80%' }}>
                <Tree 
                    data={renderTree}
                    renderCustomNodeElement={(rd3tProps) => <CustomNodeRender {...rd3tProps} />}
                    translate={translate}
                    zoom={.75}  // Adjusted zoom level
                    nodeSize={{x: 400, y: 30}}  // Adjusted node size
                    scaleExtent={{ min: 0.1, max: 2 }}  // Allow zooming in and out
                    draggable={true}
                    transitionDuration={500}
                    enableLegacyTransitions={true}
                    separation={{ siblings: 4, nonSiblings: 5}}  
                />
            </div>
        </div>
    );
}
export default TreeComponent;
