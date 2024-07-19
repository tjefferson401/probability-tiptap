import React, { useRef, useEffect, useState } from 'react';

const CustomNodeRender = ({ nodeDatum }) => {
    const textRef = useRef(null);
    const [textWidth, setTextWidth] = useState(0);

    useEffect(() => {
        if (textRef.current) {
        setTextWidth(textRef.current.getBBox().width);
        }
    }, [nodeDatum.name]);

    // Adjust the x and y offset values to change the position of the node names
    const xOffset = 0;
    const yOffset = 30; // Center the text vertically
    const rectPadding = 20;
    const rectWidth = (textWidth + rectPadding * 2) * 2;
    const rectHeight = 60; // Adjust the height as needed

    const nodeFill = nodeDatum.highlighted ? "#FFEB3B" : "#E3F2FD"; // Yellow background if highlighted, otherwise soft blue
    const nodeStroke = nodeDatum.highlighted ? "#FBC02D" : "none"; // Yellow border if highlighted, otherwise none
    const textColor = nodeDatum.highlighted ? "#F57F17" : "#0D47A1"; // Darker yellow text if highlighted, otherwise dark blue

    // rounded corners and drop shadow
    return (
        <g>
            {/* Define the drop shadow filter */}
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
            x={((xOffset - rectWidth) / 2)}
            y={(yOffset - rectHeight) / 2}
            width={rectWidth}
            height={rectHeight}
            fill={nodeFill} // Soft Blue background
            stroke= {nodeStroke}
            rx="20" // Rounded corners
            ry="20" // Rounded corners
            filter="url(#dropShadow)" // Apply the drop shadow filter
        />
        <text
            ref={textRef}
            x={xOffset}
            y={yOffset - 10} // Adjust the y position to center the text vertically
            textAnchor="middle"
            fill={textColor} // Dark Blue text
            fontSize="24"
            fontWeight="normal"
            alignmentBaseline="middle"
            style={{ fontWeight: 'normal' }}
        >
            {nodeDatum.name}
        </text>
        {(!nodeDatum.children || nodeDatum.children.length === 0) && nodeDatum.score && (
            <text
            x={xOffset}
            y={-20}
            textAnchor="middle"
            fill="#0D47A1" // Dark Blue text
            fontSize="24"
            fontWeight="normal"
            style={{ fontWeight: 'normal' }}
            >
            {nodeDatum.score}
            </text>
        )}
        </g>
    );
};

export default CustomNodeRender;