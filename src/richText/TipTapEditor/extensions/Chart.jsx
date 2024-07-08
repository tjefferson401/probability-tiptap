

// import { Node } from '@tiptap/core';
import { Chart } from 'chart.js';

// export const ChartNode = Node.create({
//   name: 'chart',

//   // Define the default attributes for your chart
//   defaultAttributes: {
//     type: 'bar',  // Chart type (bar, line, pie, etc.)
//     data: {},     // Data for the chart
//     options: {}   // Chart.js options
//   },

//   // This node is a leaf (no content inside)
//   group: 'block',
//   atom: true,

//   // Add the chart as an HTML element
//   addNodeView() {
//     return ({ node, HTMLAttributes }) => {
//       const el = document.createElement('canvas');
//       const chart = new Chart(el, {
//         type: node.attrs.type,
//         data: node.attrs.data,
//         options: node.attrs.options,
//       });

//       return {
//         dom: el,
//         update: (updatedNode) => {
//           if (updatedNode.type === node.type) {
//             chart.config.type = updatedNode.attrs.type;
//             chart.config.data = updatedNode.attrs.data;
//             chart.config.options = updatedNode.attrs.options;
//             chart.update();
//             return true;
//           }
//           return false;
//         },
//         destroy: () => {
//           chart.destroy();
//         }
//       };
//     };
//   },

//   // Parse HTML and determine how to extract the attributes
//   addAttributes() {
//     return {
//       type: {
//         default: 'bar',
//         parseHTML: element => element.getAttribute('data-type'),
//         renderHTML: attributes => ({
//           'data-type': attributes.type
//         }),
//       },
//       data: {
//         default: {},
//         parseHTML: element => JSON.parse(element.getAttribute('data-data')),
//         renderHTML: attributes => ({
//           'data-data': JSON.stringify(attributes.data)
//         }),
//       },
//       options: {
//         default: {},
//         parseHTML: element => JSON.parse(element.getAttribute('data-options')),
//         renderHTML: attributes => ({
//           'data-options': JSON.stringify(attributes.options)
//         }),
//       }
//     };
//   },

//   // Specify how this node should be serialized to HTML
//   renderHTML({ node }) {
//     return ['div', { 'data-type': node.attrs.type, 'data-data': JSON.stringify(node.attrs.data), 'data-options': JSON.stringify(node.attrs.options) }, ''];
//   },

//   // Parse the node from the DOM
//   parseHTML() {
//     return [
//       {
//         tag: 'chart-content',
//         getAttrs: dom => ({
//           type: dom.getAttribute('data-type'),
//           data: JSON.parse(dom.getAttribute('data-data')),
//           options: JSON.parse(dom.getAttribute('data-options')),
//         }),
//       },
//     ];
//   },
// });


import React, {createRef, useEffect, useRef} from 'react';
import useState from 'react-usestateref';


// tiptap
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

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
      return
    }

    // make sure that editing isn't turned off for 
    // empty latex
    if(newValue) {
      props.updateAttributes({
        editing:newValue
      })
    }
  }


  const onXLabelChange = (newXLabel) => {
    setXLabel(newXLabel)
    props.updateAttributes({
      xLabel: newXLabel
    })
  }

const onYLabelChange = (newYLabel) => {
    setYLabel(newYLabel)
    props.updateAttributes({
        yLabel: newYLabel
    })
}

const onChartTypeChange = (newChartType) => {
    setChartType(newChartType)
    props.updateAttributes({
        chartType: newChartType
    })
}

const onDataChange = (newData) => {
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
      onBlur()
    }
    if (event.key === 'Tab') {
      onBlur()
    }
  }

  if(selected && isEditable) {
    console.log("HEREE")
    return (
      <NodeViewWrapper as="span">
        <label>x Axis Label</label>
        <ControlledInput
            style={INPUT_STYLE}
            value={xLabel}
            onChange={onXLabelChange}
            onKeyDown={inputKeyDown}
            onBlur={onBlur}
            autoFocus
            size={10}
        ></ControlledInput>
        <label>y Axis Label</label>
        <ControlledInput
            style={INPUT_STYLE}
            value={yLabel}
            onChange={onYLabelChange}
            onKeyDown={inputKeyDown}
            onBlur={onBlur}
            autoFocus
            size={10}
        ></ControlledInput>
        <label>Chart Type</label>
        <ControlledInput
            style={INPUT_STYLE}
            value={chartType}
            onChange={onChartTypeChange}
            onKeyDown={inputKeyDown}
            onBlur={onBlur}
            autoFocus
            size={10}
        ></ControlledInput>
        <label>Data</label>
        <ControlledInput
            style={INPUT_STYLE}
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
  console.log("HE:(REE")

  return (
      <NodeViewWrapper>
        <ChartView
            data={data}
            xLabel={xLabel}
            yLabel={yLabel}
            chartType={chartType}
        />
      </NodeViewWrapper>
  )
}

export const ChartView = (props) => {
    const chartRef = useRef(null)

    useEffect(() => {
        if(chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            new Chart(ctx, {
                type: props.chartType,
                data: {
                    labels: props.data.map((d,i) => i),
                    datasets: [
                        {
                            label: props.yLabel,
                            data: JSON.parse(props.data),
                        }
                    ]
                }
            })
        }
    }, [props.data, props.xLabel, props.yLabel, props.chartType])


    return (
        <canvas ref={chartRef}></canvas>
    )
}