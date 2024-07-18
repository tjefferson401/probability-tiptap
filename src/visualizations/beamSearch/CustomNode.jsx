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
  const yOffset = 15;
  const rectPadding = 10;
  const rectWidth = textWidth + rectPadding * 2;
  const rectHeight = 30; // Adjust the height as needed

  return (
    <g>
      {/* <circle r="50" fill="red"></circle> */}
      <rect
        x={xOffset - rectWidth / 2}
        y={yOffset - rectHeight}
        width={rectWidth}
        height={rectHeight}
        fill="#fffec8"
        stroke="black"
      />
      <text
        ref={textRef}
        x={xOffset}
        y={yOffset - 10}
        textAnchor="middle"
        fill="black"
        fontSize="12"
        fontWeight="normal"
      >
        {nodeDatum.name}
      </text>
      {(!nodeDatum.children || nodeDatum.children.length === 0) && nodeDatum.score && (
        <text
          x={xOffset + 30}
          y={0}
          textAnchor="middle"
          fill="black"
          fontSize="12"
          style={{ fontWeight: 'normal' }}
        >
          {nodeDatum.score}
        </text>
      )}
    </g>
  );
};

export default CustomNodeRender;