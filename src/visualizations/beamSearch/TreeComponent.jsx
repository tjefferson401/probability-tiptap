import React, { useState, useEffect, useRef, useContext } from 'react';
import Tree from 'react-d3-tree';
import { useAppContext } from './BeamSearchContext';

/**
 * This function tells d3-tree what to render for each node
 * @param {object} nodeDatum - the node to render
 * @returns {JSX.Element} - the JSX element to render
 */
const customNodeRender = ({ nodeDatum }) => {
    // Adjust the x and y offset values to change the position of the node names
    const xOffset = 0;
    const yOffset = 20;
  
    return (
      <g>
        <circle r="10" fill="red"></circle>
        <text
          x={xOffset}
          y={yOffset}
          textAnchor="middle"
          fill="black"
          fontSize="12"
        >
          {nodeDatum.name}
        </text>
      </g>
    );
  };

const TreeComponent = () => {
    const { tree, setTree } = useAppContext();              // consume the tree state and setTree function from the context
    
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth, 
        height: window.innerHeight 
    });
    const [hiddenNodes, setHiddenNodes] = useState([]);

    const [renderTree, setRenderTree] = useState({
        name: 'root',
        children: []
    });


    /*
    /* @tree: the root node of the 
     * @childArray: the topK words that are predicted by the transformer model
     * @targetNode: the target node in the tree that we wish to append the children
     * 
     * @retval -- a new tree populated with children at the appropriate targetNode
    const addToTarget = (tree, childArray, targetNode, maxDepth) => {
        
        const addToTarget = (node, currentDepth) => {
        
            if (currentDepth > maxDepth) {
                return false;
            }
        
            // Base Case -- success, we have found the target; add all the children to the leaf node, return true
        
            if (node.name === targetNode && node.children.length === 0) {
                node.children = childArray.map((child) => ({
                    name: `${child}`,
                    children: [],
                }));
                return true; 
            }
        
        
            // recursive case, loop through all the children and add to the target
            for (let child of node.children) {
                addToTarget(child, currentDepth + 1);
            }
        }
        
        addToTarget(tree, 0);
        return {...tree};
        }
    
    useEffect(() => {
        // const initialTree = {
        //     name: 'root',
        //     children: []
        // };

        let updatedTree = addToTarget(tree, ['A', 'B', 'C', 'D', "E"], 'root', 0);
        updatedTree = addToTarget(updatedTree, ['A', 'B', 'C', 'D', 'E'], 'A', 1)
        updatedTree = addToTarget(updatedTree, ['A', 'B', 'C', 'D', 'E'], 'B', 1)
        updatedTree = addToTarget(updatedTree, ['A', 'B', 'C', 'D', 'E'], 'C', 1)
        updatedTree = addToTarget(updatedTree, ['A', 'B', 'C', 'D', 'E'], 'D', 1)
        updatedTree = addToTarget(updatedTree, ['A', 'B', 'C', 'D', 'E'], 'E', 1)
        updatedTree = addToTarget(updatedTree, ["what", "the", "sigma"], 'A',2)

        // const updatedTree = addToTarget(updatedTreeAgain, ['A', 'B', 'C'], 'B', 1)
        // const finalTree = addToTarget(updatedTreeAgainAgain, ['A', 'B', 'C'], 'C', 1);
        // console.log("Final Tree:", finalTree);
        setTree(updatedTree);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);



    const filterTree = (node) => {
        if (hiddenNodes.includes(node.name)) {
            return null;
        } 
        return {
            ...node,
            children: node.children.map(filterTree).filter(Boolean)
        }
    }
    */

    const translate = {
        x: dimensions.width / 32,  // Adjusted for better positioning
        y: dimensions.height / 2.25   // Adjusted for better positioning
    };

    const hideNodes = () => {
        const toHide = ['what', 'sigma']
        setHiddenNodes(toHide)
    }

    const animate = () => {
        console.log('Animating!');

        // render the roots we care about and their children
        // Step 0: Loading the input sequence into the root node's children
        console.log("Children", tree.children[0])

        let root = {
            name: tree.children[0].name,
            children: []
        }

        let updatedTree = {
            ...renderTree,
            children: [root]
        }

        setRenderTree(updatedTree)


        //Wait 1 second before continuing
        setTimeout(() => {
            let layer = tree.children
            console.log('Layer:', layer)
            
            let beams = []
            for (let beam of layer) {

                let candidates  = []
                for (let child of beam.children) {
                    let candidate = {
                        name: child.name,
                        children: []
                    }

                    console.log("Candidate:", candidate)

                    candidates.push(candidate)
                }
                beams.push({
                    name: beam.name,
                    children: candidates
                })
            }

            updatedTree = {
                ...renderTree,
                children: beams
            }

            setRenderTree(updatedTree)  

            console.log(beams)

            // Prune and Pick the new Beams
            setTimeout(() => {
                // look two ahead
                let toKeep = []
                let stage = tree.children
                console.log("Stage", stage)


                // RIGHT NOW BEAM IS GRABBING THE INDEX OF STAGE INSTEAD OF THE CHILD OBJECT
                for (let beam in stage) {
                    console.log("Beam", beam)

                    for (let child of beam.children) {
                        console.log("Child", child)
                        if (child.children) {
                            toKeep.push(child)
                        }
                    }
                }

                console.log("To Keep", toKeep)
                updatedTree = {
                    ...renderTree,
                    children: toKeep
                }

            }, 1000);

        }, 1000);








        // Step 1: Get all children from children of the root
    //     const roots = fakeTree.children;
    //     console.log('Roots:', roots);

    //     let candidates = roots[0].children.map((child) => ({
    //             ...child,
    //             children: []
    //     }));

    //     console.log('Candidates:', candidates);

    //     updatedTree = {
    //         ...tree,
    //         children: candidates
    //     }

    //     console.log('Updated Tree:', updatedTree);
        
    //     // setTree(updatedTree)
    }


    return (
        <div style={{display: 'flex', height: '100vh', width: '100vw'}}>
            <div style ={{width: '20%'}}>
                <button onClick={hideNodes}>Hide Nodes!</button>
                <button onClick={animate}>Animate!</button>
            </div>
            <div style={{ width: '80%' }}>
                <Tree 
                    data={renderTree}
                    renderCustomNodeElement = {customNodeRender}
                    translate={translate}
                    zoom={.75}  // Adjusted zoom level
                    nodeSize={{x: 200, y: 30}}  // Adjusted node size
                    scaleExtent={{ min: 0.1, max: 2 }}  // Allow zooming in and out
                    draggable={true}
                    transitionDuration={500}
                    enableLegacyTransitions={true}
                    separation={{ siblings: 1, nonSiblings: 1.5}}  
                />
            </div>
        </div>
    );
}
export default TreeComponent;
