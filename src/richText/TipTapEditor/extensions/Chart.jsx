

// import { Node } from '@tiptap/core';
import { Chart } from 'chart.js';
import React, {createRef, useEffect, useRef} from 'react';
import useState from 'react-usestateref';


// tiptap
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ControlledInput } from './InlineTex';

/**
 * Notes: Controlling the cursor is very important. Specifically, when you set
 * the tex, you need to reset the cursor position.
 */
// data, xLabel = 'x', yLabel='Pr', chartType='bar'

export const ChartBlock = Node.create({
    name: 'chart-block',
    inline: false,
    group: 'block',
    atom: true,
    selectable:false,
    addAttributes() {
        return {
          data: {
            default: [],
          },
            xLabel: {
                default: 'x'
            },
            yLabel: {
                default: 'Pr'
            },
            chartType: {
                default: 'bar'
            },
          editing: {
            default:  true
          }
        }
      },
      
    
      parseHTML() {
        return [
          {
            tag: 'chart-block',
          },
        ]
      },
    
      renderHTML({ HTMLAttributes }) {
        return ['chart-block', mergeAttributes(HTMLAttributes)]
      },
    
      addNodeView() {
        return ReactNodeViewRenderer(RenderChartBlock)
      },
  })

export const RenderChartBlock = (props) => {
  
    // let data = props.node.attrs.data
    // let xLabel = props.node.attrs.xLabel
    // let yLabel = props.node.attrs.yLabel
    // let chartType = props.node.attrs.chartType

  let selected = props.node.attrs.editing
  const [isEditable, setIsEditable, editableRef] = useState(props.editor.isEditable)
  const [data, setData, dataRef] = useState(props.node.attrs.data)
    const [xLabel, setXLabel, xLabelRef] = useState(props.node.attrs.xLabel)
    const [yLabel, setYLabel, yLabelRef] = useState(props.node.attrs.yLabel)
    const [chartType, setChartType, chartTypeRef] = useState(props.node.attrs.chartType)


  useEffect(() => {
    props.editor.on('transaction', () => {
        if(props.editor.isEditable != editableRef.current) {
          setIsEditable(props.editor.isEditable)
        }
      })
  }, [])

  const setSelected = (newValue) => {
    

    // ignore this if you are not editable
    if(!isEditable && newValue) {
      console.log("HERE1111")
      return
    }

    // make sure that editing isn't turned off for 
    // empty latex
      props.updateAttributes({
        editing:newValue
      })
  }


  const onXLabelChange = (event) => {
    const newXLabel = event.target.value

    setXLabel(newXLabel)
    props.updateAttributes({
      xLabel: newXLabel
    })
  }

const onYLabelChange = (event) => {
    const newYLabel = event.target.value
    setYLabel(newYLabel)
    props.updateAttributes({
        yLabel: newYLabel
    })
}

const onChartTypeChange = (event) => {
    const newChartType = event.target.value
    setChartType(newChartType)
    props.updateAttributes({
        chartType: newChartType
    })
}

const onDataChange = (event) => {
    const newData = event.target.value
    setData(newData)
    props.updateAttributes({
        data: newData
    })
}


  const onBlur = () => {
    setSelected(false)
    props.editor.commands.focus()
  }

  const inputKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSelected(false)
    }
    if (event.key === 'Tab') {
      setSelected(false)
    }
  }


  if(selected && isEditable) {
    return (
      <NodeViewWrapper as="span">
        <label>x Axis Label</label>
        <ControlledInput
            value={xLabel}
            onChange={onXLabelChange}
            onKeyDown={inputKeyDown}
            onBlur={onBlur}
            autoFocus
            size={10}
        ></ControlledInput>
        <label>y Axis Label</label>
        <ControlledInput
            value={yLabel}
            onChange={onYLabelChange}
            onKeyDown={inputKeyDown}
            onBlur={onBlur}
            autoFocus
            size={10}
        ></ControlledInput>
        <label>Chart Type</label>
        <ControlledInput
            value={chartType}
            onChange={onChartTypeChange}
            onKeyDown={inputKeyDown}
            onBlur={onBlur}
            autoFocus
            size={10}
        ></ControlledInput>
        <label>Data</label>
        <ControlledInput
            value={data}
            onChange={onDataChange}
            onKeyDown={inputKeyDown}
            onBlur={onBlur}
            autoFocus
            size={10}
        ></ControlledInput>

      </NodeViewWrapper>
    )
  }


  return (
      <NodeViewWrapper>
        <ChartView
            data={data}
            xLabel={xLabel}
            yLabel={yLabel}
            chartType={chartType}
            setSelected={setSelected}
        />
      </NodeViewWrapper>
  )
}

export const ChartView = (props) => {
    const canvasRef = useRef(null)
    const chartRef = useRef(null)
    const setSelected = props.setSelected

    const onChartClick = (event) => {
      setSelected(true)
    }

    useEffect(() => {
      console.log(props.data)
      const data = JSON.parse(props.data)
      console.log(data)
        if(canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if(chartRef.current) {
              chartRef.current.destroy()
            }
            chartRef.current = new Chart(ctx, {
                type: props.chartType,
                data: {
                    labels: data.map((d,i) => i),
                    datasets: [
                        {
                            label: props.yLabel,
                            data: data
                        }
                    ]
                }
            })
        }

        return () => {
            if(chartRef.current) {
              chartRef.current.destroy()
            }
        
        }
    }, [props.data, props.xLabel, props.yLabel, props.chartType])


    return (
        <canvas ref={canvasRef} id="0" onClick={onChartClick}></canvas>
    )
}