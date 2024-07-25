import React, { useState, useEffect, useRef, useContext } from 'react';
import Tree from 'react-d3-tree';
import { useAppContext } from './BeamSearchContext';
import CustomNodeRender from './CustomNode';

const TreeComponent = () => {

    const {config} = useAppContext();

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth, 
        height: window.innerHeight 
    });

    console.log(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const translate = {
        x: dimensions.width - dimensions.width,  // Adjusted for better positioning
        y: dimensions.height / 2.25   // Adjusted for better positioning
    };

    return (
        <div style={{ width: '100%', height:'100%' }}>
            <Tree 
                data={config.renderTree}
                renderCustomNodeElement={(rd3tProps) => <CustomNodeRender {...rd3tProps} />}
                translate={translate}
                zoom={0.75}  // Adjusted zoom level
                nodeSize={{ x: 400, y: 30 }}  // Adjusted node size
                scaleExtent={{ min: 0.1, max: 2 }}  // Allow zooming in and out
                draggable={true}
                transitionDuration={500}
                enableLegacyTransitions={true}
                separation={{ siblings: 4, nonSiblings: 5 }}
            />
        </div>
    );
}
export default TreeComponent;
