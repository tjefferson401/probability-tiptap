import React, { useState, useEffect, useRef, useContext } from 'react';
import Tree from 'react-d3-tree';
import { useAppContext } from './BeamSearchContext';
import CustomNodeRender from './CustomNode';

    const TreeComponent = () => {

        const {config, setConfig} = useAppContext();

        const dimensions = {
            width: window.innerWidth, 
            height: window.innerHeight 
        };

        const [treeKey, setTreeKey] = useState(0);

        const initialTranslate = {
            x: dimensions.width - dimensions.width,  // As far left as possible
            y: dimensions.height / 2   // Center of the Screen
        };

        const [translate, setTranslate] = useState(initialTranslate);

        /* calculateZoom - sets the zoom level based on the number of beams
         * @param {number} numBeams - the number of beams in the beam search
         * @return {number} the zoom level to be set
         */
        const calculateZoom = (numBeams) => {
            if (numBeams === 1 || numBeams === 2) {
                return 0.75;
            } else if (numBeams === 3) {
                return 0.5;
            } else {
                return -1; // Default zoom value, change as needed
            }
        };

        useEffect(() => {
        // When the number of beams changes, calculate the new zoom level, and set the config state
            const newZoom = calculateZoom(config.numBeams);
            setConfig((prevConfig) => ({...prevConfig, zoom: newZoom}));
        }, [config.numBeams]);


        useEffect(() => {
        // When the tree is reset, reload the tree with the initial translate values and reset the key
            if (config.tree === null) {
                setTranslate(initialTranslate);
                // Force rerender of Tree component
                setTreeKey((prevKey) => prevKey + 1);
            }
        }, [config.tree]);


    return (
        <div style={{
             width: '100%', 
             height:'100%', 
             position:'relative'
            }}>

            <Tree 
                key={treeKey}
                data={config.renderTree}
                renderCustomNodeElement={(rd3tProps) => <CustomNodeRender {...rd3tProps} />}
                translate={translate}
                zoom = {config.zoom}
                nodeSize={{ x: 400, y: 30 }} 

                // Disable Zooming when the Visualization is Running
                scaleExtent={config.isRunning ?  { min: config.zoom, max: config.zoom } : { min: 0.1, max: 2 }}
                draggable={config.isDraggable}
                transitionDuration={500}
                enableLegacyTransitions={true}
                separation={{ siblings: 3, nonSiblings: 4}}
            />
        </div>
    );
}
export default TreeComponent;
