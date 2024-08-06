import React, { useState, useEffect, useRef, useContext } from 'react';
import Tree from 'react-d3-tree';
import { useAppContext } from './BeamSearchContext';
import CustomNodeRender from './CustomNode';
import OutputBar from './OutputBar';

    const TreeComponent = () => {

        const {config, setConfig} = useAppContext();

        const [dimensions, setDimensions] = useState({
            width: window.innerWidth, 
            height: window.innerHeight 
        });

        const [treeKey, setTreeKey] = useState(0);

        const initialTranslate = {
            x: dimensions.width - dimensions.width,  // Adjusted for better positioning
            y: dimensions.height / 2   // Adjusted for better positioning
        };

        const [translate, setTranslate] = useState(initialTranslate);
        console.log(window.innerWidth)

        // useEffect(() => {
        //     const handleResize = () => {
        //         setDimensions({
        //             width: window.innerWidth,
        //             height: window.innerHeight
        //         });
        //     };
        //     window.addEventListener('resize', handleResize);
        //     return () => {
        //         window.removeEventListener('resize', handleResize);
        //     };
        // }, []);

        const calculateZoom = (numBeams) => {
            console.log("Number of Beams:", numBeams);

            if (numBeams === 1 || numBeams === 2) {
                return 0.75;
            } else if (numBeams === 3) {
                return 0.5;
            } else if (numBeams === 4) {
                return 0.35;
            } else {
                return -1; // Default zoom value, change as needed
            }
        };

        useEffect(() => {
            const newZoom = calculateZoom(config.numBeams);
            console.log("New Zoom:", newZoom);

            setConfig((prevConfig) => ({...prevConfig, zoom: newZoom}));
        }, [config.numBeams]);

        console.log("Translate:", translate.x, translate.y);

        useEffect(() => {
            if (config.tree === null) {
                // Perform the reload or reset logic here
                setTranslate(initialTranslate);
                setTreeKey((prevKey) => prevKey + 1); // Change key to force rerender of Tree component
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
                zoom={config.zoom}  // Adjusted zoom level
                nodeSize={{ x: 400, y: 30 }}  // Adjusted node size
                scaleExtent={config.showResetButton ? { min: 0.1, max: 2 } : { min: 1, max: 1 }}
                // scaleExtent={{ min: 0.1, max: 2 }}  // Allow zooming in and out
                draggable={config.isDraggable}
                transitionDuration={500}
                enableLegacyTransitions={true}
                separation={{ siblings: 3, nonSiblings: 4 }}
            />
            {/* <OutputBar /> */}
        </div>
    );
}
export default TreeComponent;
