import React, { useState, useEffect, useRef, useContext } from 'react';
import Tree from 'react-d3-tree';
import { useAppContext } from './BeamSearchContext';
import CustomNodeRender from './CustomNode';

const TreeComponent = () => {

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth, 
        height: window.innerHeight 
    });


    const translate = {
        x: dimensions.width / 32,  // Adjusted for better positioning
        y: dimensions.height / 2.25   // Adjusted for better positioning
    };


    return (
        <div>
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
