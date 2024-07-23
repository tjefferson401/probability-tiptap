import React, { useRef, useLayoutEffect, useState } from 'react';

const CustomNodeRender = ({ nodeDatum }) => {

    const foreignObjectRef = useRef(null);
    const [rectHeight, setRectHeight] = useState(60); // Initial height

    useLayoutEffect(() => {
        if (foreignObjectRef.current) {
            const foreignObjectElement = foreignObjectRef.current;
            let height = foreignObjectElement.getBoundingClientRect().height;
            height = 60;
            setRectHeight(height + 20); // Add padding to height
        }
    }, [nodeDatum.name]);

    const xOffset = 0;
    const yOffset = rectHeight / 2;
    const rectPadding = 20;
    const rectWidth = 300; // Set a fixed width for the rect and foreignObject

    const nodeFill = nodeDatum.highlighted ? "#FFEB3B" : "#E3F2FD"; // Yellow background if highlighted, otherwise soft blue
    const nodeStroke = nodeDatum.highlighted ? "#FBC02D" : "none"; // Yellow border if highlighted, otherwise none
    const textColor = nodeDatum.highlighted ? "#F57F17" : "#0D47A1"; // Darker yellow text if highlighted, otherwise dark blue

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
                x={((xOffset - rectWidth) / 2)}
                y={(yOffset - rectHeight) / 2}
                width={rectWidth}
                height={rectHeight}
                fill={nodeFill} // Soft Blue background
                stroke={nodeStroke}                
                rx="20" // Rounded corners
                ry="20" // Rounded corners
                filter="url(#dropShadow)" // Apply the drop shadow filter
            />

        {/* <text
            ref={textRef}
            x={xOffset}
            y={yOffset - 10} // Adjust the y position to center the text vertically
            textAnchor="middle"
            fill={textColor}
            fontSize="24"
            fontWeight="normal"
            alignmentBaseline="middle"
            style={{ fontWeight: 'normal' }}
        >
            {nodeDatum.name}
        </text> */}

            <foreignObject
                ref={foreignObjectRef}
                x={(xOffset - rectWidth) / 2}
                y={(yOffset - rectHeight) / 2}
                width={rectWidth}
                height={rectHeight}
            >
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ color: textColor, fontSize: '24px', fontWeight: 'normal', whiteSpace: 'pre-wrap', wordWrap: 'break-word', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    {nodeDatum.name}
                </div>
            </foreignObject>

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