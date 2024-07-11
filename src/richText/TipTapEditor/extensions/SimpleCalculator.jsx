import { useEffect, useState } from "react"
import { CalcTypes } from "../support/calculatorTypes"
import katex from 'katex'
import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { mergeAttributes } from '@tiptap/core'
import useStateRef from "react-usestateref"


export const SimpleCalculator = Node.create({ 
    name: 'simple-calculator',
    inline: false,
    group: 'block',
    atom: true,
    selectable:false,
    addAttributes() {
        return {
            calcType: {
            default: '',
            },
            inputs: {
                default: {}
            },
            editing: {
                default:  true
            }
        }
        },
        
    
        parseHTML() {
        return [
            {
            tag: 'simple-calculator',
            },
        ]
        },
    
        renderHTML({ HTMLAttributes }) {
        return ['simple-calculator', mergeAttributes(HTMLAttributes)]
        },
    
        addNodeView() {
        return ReactNodeViewRenderer(RenderSimpleCalculator)
        },
    })



    const RenderSimpleCalculator = (props) => {
        const currentlyEditing = props.node.attrs.editing;
        const [isEditable, setIsEditable, editableRef] = useStateRef(props.editor.isEditable)
        const [calcType, setCalcType, calcTypeRef] = useStateRef(props.node.attrs.calcType)

        useEffect(() => {
            props.editor.on('transaction', () => {
                if(props.editor.isEditable != editableRef.current) {
                    setIsEditable(props.editor.isEditable)
                }
            })
        }, [])

        const setEditing = (newValue) => {
            if(!isEditable && newValue) {
                return
            }
            props.updateAttributes({
                editing: newValue
            })
        }


        if(currentlyEditing) {
            return <NodeViewWrapper><CalcTypesSelect setEditing={setEditing} calcType={calcType} setCalcType={setCalcType} /></NodeViewWrapper>
        }

        if(calcType && calcType in CalcTypes) {
            return <NodeViewWrapper><RenderCalc calcInfo={CalcTypes[calcType]} setEditing={setEditing}  tiptapEditing={props.editor.isEditable}/></NodeViewWrapper>
        }


        return <NodeViewWrapper><button
        onClick={() => setEditing(true)}
        >No Calc type selected</button></NodeViewWrapper>

        


    }



    const CalcTypesSelect = ({calcType, setCalcType, setEditing}) => {

        return (
            <>
            <select value={calcType} onChange={(e) => setCalcType(e.target.value)} className="form-control">
                <option value="">Select a calculator type</option>
                {Object.keys(CalcTypes).map((key) => {
                    return <option key={key} value={key}>{CalcTypes[key].latexTitle}</option>
                })}
            </select>
            {calcType &&  <button onClick={() => setEditing(false)}>Apply</button>}
            </>
        )
    }


    /**
     * sample calcInfo
    "normCDF": {
        latexTitle: "NormCDF(x)",
        inputs: [
            {
                label: "x",
                type: "number",
                value: 0
            },
            {
                label: "mu", 
                type: "number",
                value: 0
            },
            {
                label: "std", 
                type: "number",
                value: 0
            }
        ],
        functionName: "norm.cdf",
        function: normCDF
    },
     */


    const RenderCalc = ({calcInfo, tiptapEditing, setEditing}) => {
        const latexTitle = calcInfo.latexTitle
        const inputs = calcInfo.inputs
        const functionName = calcInfo.functionName
        const func = calcInfo.function
        const [userInputs, setUserInputs] = useState({})
        const [output, setOutput] = useState(null)

        useEffect(() => {
            let newInputs = {}
            inputs.forEach((input) => {
                newInputs[input.label] = input.value
            })
            setUserInputs(newInputs)
        }, [])

        useEffect(() => { 
            const latexTitleElement = document.getElementById("latextitle")
            if(latexTitleElement) {
                katex.render(latexTitle, latexTitleElement, {
                    displayMode: true,
                    throwOnError: false,
                
                })
            }
        }, [latexTitle])

        return (
            <div className="d-flex flex-column">
                <span id="latextitle"/>
                {inputs.map((input) => {
                    return <div>
                    <label>{input.label}</label>
                    <input key={input.label} type={input.type} value={userInputs[input.label]} onChange={(e) => setUserInputs({...userInputs, [input.label]: e.target.value})} />
                    </div>
                })}
                <button onClick={() => {
                    const values = Object.values(userInputs)
                    setOutput(func(...values))
                }}
                className="btn btn-primary"
                style={{ fontFamily: "monospace" }}
                >{functionName}</button>
                {output !== null && <div>{output}</div>}
                {tiptapEditing && <button onClick={() => setEditing(true)} className="btn btn-small">Switch content</button>}
            </div>
        )

    }