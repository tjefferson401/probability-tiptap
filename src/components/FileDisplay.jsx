import { useEffect, useState } from "react"
import { RichTextEditor } from "../richText/RichTextEditor"



export const FileDisplay = ({filePath, setCurrFile }) => {
    const [fileContent, setFileContent] = useState(null)
    const [isEditable, setIsEditable] = useState(false)

    useEffect(() => {
        const fetchFile = async () => {
            const response = await fetch(filePath)
            const text = await response.text()
            setFileContent(text)
        }
        fetchFile()
    }, [filePath])

    console.log(fileContent)
    return <div className="h-100">
        <button onClick={() => setCurrFile(null)}>Back</button>
        <button onClick={() => setIsEditable(!isEditable)}>Toggle Editable</button>
        <h1>{filePath}</h1>
        <div className="border border-rounded p-2">
            <RichTextEditor
                editable={isEditable}
                content={fileContent}
                firebaseDocPath={filePath}
                user={{ name: 'test' }}
            />
        </div>
    </div>
}