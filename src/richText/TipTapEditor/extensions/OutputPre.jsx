import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const MAX_OUTPUT_HEIGHT_LINES = 10

export const OutputPre = ({output, inputActive}) => {
  const outputRef = useRef();
  const inputRef = useRef();

  const [outputHeight, setOutputHeight] = useState(getOutputHeight(output,outputRef)); // Default height

  useEffect(() => {
    setOutputHeight(getOutputHeight(output,outputRef));
  }, [output]);

  

  // Update the onInputEntered to resolve the promise
  const onInputEntered = (input) => {
    // if (resolveInputPromise) {
      // resolveInputPromise(input);
      // setResolveInputPromise(null); // Reset for the next input
    // }
  };

  return <>
    <pre
      ref={outputRef}
      spellCheck="false"
      style={{
        backgroundColor: 'black',
        color: 'white',
        height: outputHeight,
        marginBottom: '0px',
        padding: '5px',
      }}
    >
      {output}
      {inputActive && (
        <ConsoleInput
          autoFocus
          type="text"
          id="input"
          name="input"
          ref={inputRef}
          // on enter call onInputEntered (onkeypress is depricated)
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onInputEntered(e.target.value)
            }
          }}

        />
      )}
    </pre>
  </>
}

function getOutputHeight(output,outputRef) {
  const lineCount = output.split('\n').length;
  const displayLines = Math.min(MAX_OUTPUT_HEIGHT_LINES, lineCount)
  const lineHeight = getLineHeight(outputRef.current);
  const newHeight = displayLines * lineHeight;
  return `${newHeight + 5}px`;
}

function getLineHeight(element) {
  const estimatedHeight = 18
  if(!element) return estimatedHeight;
  try {
    const lineHeight = window.getComputedStyle(element).getPropertyValue('line-height');
    return parseInt(lineHeight);
  } catch (e) {
    console.log('Error getting line height', e)
    return estimatedHeight;
  }
}

const ConsoleInput = styled.input`
  background-color: black;
  color: white;
  border: none;
  width: 100%;
  min-width: 50px;
  width: fit-content;
  margin: 0;
  font-size: 1em;
  &:focus {
    outline: none;
  }
`;