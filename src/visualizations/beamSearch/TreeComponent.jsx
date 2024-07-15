import React, { useState, useEffect, useRef, useContext } from 'react';
import Tree from 'react-d3-tree';
import { useAppContext } from './BeamSearchContext';

const TreeComponent = () => {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const { tree, setTree } = useAppContext();

    const [hiddenNodes, setHiddenNodes] = useState([]);

    console.log("Tree in TreeComponent", tree)

    

    /* @tree: the root node of the 
     * @childArray: the topK words that are predicted by the transformer model
     * @targetNode: the target node in the tree that we wish to append the children
     * 
     * @retval -- a new tree populated with children at the appropriate targetNode
     */
    const addToTarget = (tree, childArray, targetNode, maxDepth) => {
        
        const addToTarget = (node, currentDepth) => {

            if (currentDepth > maxDepth) {
                return false;
            }

            // Base Case -- success, we have found the target; add all the children to the leaf node, return true

            if (node.name === targetNode && node.children.length === 0) {
                node.children = childArray.map((child, index) => ({
                    name: `${child}`,
                    children: [],
                }));
                return true; 
            }


            // recursive case, loop through all the children and add to the target
            for (let child of node.children) {
                if (addToTarget(child, currentDepth + 1)) {
                    return true;
                }
            }
            return false;
        }

        addToTarget(tree, 0);
        return tree;
    }

    useEffect(() => {
        const initialTree = {
            name: 'root',
            children: []
        };

        let updatedTree = addToTarget(initialTree, ['A', 'B', 'C', 'D', "E"], 'root', 0);
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
    }, [setTree]);

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const translate = {
        x: dimensions.width / 32,  // Adjusted for better positioning
        y: dimensions.height / 2.25   // Adjusted for better positioning
    };

    const nodeSize = { x: 200, y: 30 };  // Adjusted node size

    const hideNodes = () => {
        const toHide = ['what', 'sigma']
        setHiddenNodes(toHide)
    }

    const filterTree = (node) => {
        if (hiddenNodes.includes(node.name)) {
            return null;
        } 
        return {
            ...node,
            children: node.children.map(filterTree).filter(Boolean)
        }
    }

    return (
        <div style={{display: 'flex', height: '100vh', width: '100vw'}}>
            <div style ={{width: '20%'}}>
                <button onClick ={hideNodes}>Hide Nodes!</button>
            </div>

            <div style={{width: '80%'}}>
                <Tree 
                    data={filterTree(tree)}
                    translate={translate}
                    zoom={.75}  // Adjusted zoom level
                    nodeSize={nodeSize}
                    scaleExtent={{ min: 0.1, max: 2 }}  // Allow zooming in and out
                    draggable={true}
                    transitionDuration={500}
                    enableLegacyTransition={true}
                />
            </div>
        </div>
    );
}
export default TreeComponent;
