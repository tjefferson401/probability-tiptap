
import React, {useEffect, useRef} from 'react';
import useState from 'react-usestateref';
import { v4 as uuid } from 'uuid'
import * as d3 from 'd3'

// tiptap
import { NodeViewWrapper } from '@tiptap/react'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const Paper = Node.create({
    name: 'paper',
    group: 'block',
    atom: true,
    addAttributes() {
        return {
            lines: {
                default: [],
            },
        }
      },
    
      parseHTML() {
        return [
          {
            tag: 'paper',
          },
        ]
      },
    
      renderHTML({ HTMLAttributes }) {
        return ['paper', mergeAttributes(HTMLAttributes)]
      },
    
      addNodeView() {
        return ReactNodeViewRenderer(RenderPaper)
      },
  })

  export const RenderPaper = (props) => {
    const [color, setColor, colorRef] = useState('#0000ff')
    const [size, setSize, sizeRef] = useState(8)

    const canvasRef = useRef()

    const points = useRef()
    const currId = useRef()

    useEffect(()=> {
        // constructor
        currId.current = null
        linesTemp.current = props.node.attrs.lines
    },[])

    // you should *not* need this. It should be props.node.attrs.lines
    // but in the requestAnimationFrame function, Im getting a stale version
    const linesTemp = useRef()

    useEffect(() => {
        if(canvasRef && canvasRef.current) {
            canvasRef.current.addEventListener("mousedown",onStartDrawing)
            canvasRef.current.addEventListener("mouseup",onEndDrawing)
            canvasRef.current.addEventListener("mouseleave",onEndDrawing)
            canvasRef.current.addEventListener('touchstart', onStartDrawing)
            canvasRef.current.addEventListener('touchend', onEndDrawing)
            canvasRef.current.addEventListener('touchleave', onEndDrawing)
        }
    }, [canvasRef])

    useEffect(() => {
        linesTemp.current = props.node.attrs.lines
    }, [props.node.attrs.lines])

    const onStartDrawing = (event) => {
        // don't draw a new line in these base cases
        if(currId.current) return
        if(!props.editor.isEditable) return

        // make a new line!
        points.current = []
        currId.current = uuid()
  
        const moveEvent = event.type === 'mousedown'
          ? 'mousemove'
          : 'touchmove'
  
        canvasRef.current.addEventListener(moveEvent, onMove)
      }

      const onColorPicked = (event) => {
          
          setColor(event.target.value)
      }

      const onSizeChanged = (event)  => {
          let newSize = event.target.value
          setSize(newSize)
      }
  
      const onMove = (event) => {
        event.preventDefault()
        points.current.push(d3.pointers(event)[0])
        tick()
      }
  
      const onEndDrawing = () => {
        canvasRef.current.removeEventListener('mousemove', onMove)
        canvasRef.current.removeEventListener('touchmove', onMove)
  
        currId.current = null
        
        // this mysterious line was in the vue code
        // this.svg.select(`#id-${this.id}`).remove()
      }
  
      const tick = () => {
        requestAnimationFrame(() => {
            const curveFactory = d3.line().curve(d3.curveBasis)
            const path = curveFactory(points.current)
            // all the lines except our current one
            let lines = linesTemp.current
            const otherLines = lines.filter(item => item.id !== currId.current)
            let newLines = [
                ...otherLines,
                {
                    id: currId.current,
                    color: colorRef.current,
                    size: sizeRef.current,
                    path,
                },
            ]
            linesTemp.current = newLines
            props.updateAttributes({
                lines: newLines
            })
        })
      }
  
      const clear = () => {
        props.updateAttributes({
          lines: [],
        })
        linesTemp.current = []
      }

    // the lines on this canvas
    let lines = props.node.attrs.lines
    return (
        <NodeViewWrapper>
            <div className='d-flex'>
                <input type="color" value={color} onChange={(e) => onColorPicked(e)}></input>
                <input
                    type="number"
                    min="1"
                    max="10"
                    value={size}
                    onChange={(e) => onSizeChanged(e)}
                ></input>
                <button onClick={() => clear()}>clear</button>
            </div>
            <svg className="paperCanvas" viewBox="0 0 500 250" ref={canvasRef}
            >

            {lines.map(line => (
                <path 
                    key = {line.id}
                    stroke={line.color} 
                    fill="none" 
                    d={line.path}
                    strokeWidth={line.size}
                />
            ))}
            </svg>
        </NodeViewWrapper>
    );
};
      
      

