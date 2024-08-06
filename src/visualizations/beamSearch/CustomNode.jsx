import React, { useRef, useLayoutEffect, useState } from 'react';
import { useAppContext } from './BeamSearchContext';

const replaceSpecialTokens = (input) => {
    return input
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/"/g, '\\"')
    //   .replace(/'/g, "\\'");
  };

const CustomNodeRender = ({ nodeDatum }) => {
    const foreignObjectRef = useRef(null);
    const textRef = useRef(null);
    const [rectSize, setRectSize] = useState({ width: 300, height: 60 });

    const { config } = useAppContext();

    useLayoutEffect(() => {
        if (foreignObjectRef.current && textRef.current) {
            const textElement = textRef.current;

            let width = textElement.scrollWidth + 20; // Add padding to width
            let height = textElement.scrollHeight + 10; // Add padding to height

            setRectSize({ width, height });
        }
    }, [nodeDatum.name]);

    if (nodeDatum.name === 'root' && !nodeDatum.score) {
        return null;
    }

    const xOffset = 0;
    const yOffset = rectSize.height / 2;
    // const rectPadding = 20;
    // const rectWidth = 300; // Set a fixed width for the rect and foreignObject

    const nodeFill = nodeDatum.highlighted ? "#FFEB3B" : "#E3F2FD"; // Yellow background if highlighted, otherwise soft blue
    const nodeStroke = nodeDatum.highlighted ? "#FBC02D" : "none"; // Yellow border if highlighted, otherwise none
    const textColor = nodeDatum.highlighted ? "#F57F17" : "#0D47A1"; // Darker yellow text if highlighted, otherwise dark blue

    console.log("Current Node:", nodeDatum);

    // rounded corners and drop shadow
    return (
        <g>
            <defs>
                <filter id="dropShadow" x="-20%" y="-20%" width="150%" height="150%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="2" dy="2" result="offsetblur"/>
                    <feFlood floodColor="rgba(0,0,0,0.3)"/>
                    <feComposite in2="offsetblur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
        
            <rect
                x={((xOffset - rectSize.width) / 2)}
                y={(yOffset - rectSize.height) / 2}
                width={rectSize.width}
                height={rectSize.height}
                fill={nodeFill} // Soft Blue background
                stroke={nodeStroke}                
                rx="20" // Rounded corners
                ry="20" // Rounded corners
                filter="url(#dropShadow)" // Apply the drop shadow filter
                style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }}
            />

            <foreignObject
                ref={foreignObjectRef}
                x={(xOffset - rectSize.width) / 2}
                y={(yOffset - rectSize.height) / 2}
                width={rectSize.width}
                height={rectSize.height}
                style={{ transition: 'transform 0.2s ease' }}
            >
                <div ref = {textRef} xmlns="http://www.w3.org/1999/xhtml" style={{ 
                    color: textColor, 
                    fontSize: '32px', 
                    fontWeight: 'normal', 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis', 
                    textAlign: 'center', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100%',
                    transition: 'color 0.3s ease',
                    padding: '0 20px' // Adding padding to ensure text does not touch edges
                    }}
                >
                    {replaceSpecialTokens(nodeDatum.name)}
                </div>
            </foreignObject>

            {(!nodeDatum.children || nodeDatum.children.length === 0) && nodeDatum.score && (
                <text
                    x={xOffset}
                    y={0}
                    textAnchor="middle"
                    fill="#0D47A1"
                    fontSize="24px"
                    fontWeight="normal"
                    style={{ fontWeight: 'normal' }}
                >
                    {config.showLogProbs ? nodeDatum.score : nodeDatum.rank}
                </text>
            )}
        </g>
    );
};

export default CustomNodeRender;