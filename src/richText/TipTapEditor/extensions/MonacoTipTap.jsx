import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useState } from 'react';
import { latexMonarchDefinition } from '../../components/latexMonarch';

export const MonacoTipTap = ({ value, onChange, readOnly, mode = "python" }) => {
  const [editorHeight, setEditorHeight] = useState(getDefaultHeight(value)); // Default height

  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  

  const handleEditorDidMount = (editor, monaco) => {
    monacoRef.current = monaco;
    editorRef.current = editor;
    fixEditorHeight(editor, monaco);
    monaco.languages.register({ id: 'latex' });
    monaco.languages.setMonarchTokensProvider('latex', latexMonarchDefinition);
  };

  const handleChange = (e) => {
    onChange(e)
    fixEditorHeight(editorRef.current, monacoRef.current);
  }

  const fixEditorHeight = (editor, monaco) => {
    // const editor = monaco.editor;
    const lineCount = editor.getModel()?.getLineCount() || 1;
    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const newHeight = lineCount * lineHeight;
    setEditorHeight(`${newHeight + 5}px`);
  };



  return <Editor
    width={"100%"}
    height={editorHeight}
    value={value}
    onChange={handleChange}
    defaultLanguage={mode}
    options={{
      readOnly: readOnly,
      fontSize: 14,
      padding: "0",
      scrollBeyondLastColomn: false,
      scrollBeyondLastLine: false,
      lineNumbersMinChars: 2,  // Set this to a lower value to decrease gutter size
      scrollbar: {
        vertical: 'hidden',
        horizontal: 'hidden',
        alwaysConsumeMouseWheel: false,
      },
      minimap: {
        enabled: false
      },
    }}

    onMount={handleEditorDidMount}
  />;
};

function getDefaultHeight(code) {
  const lineCount = code.split('\n').length;
  const lineHeight = 20;
  const newHeight = lineCount * lineHeight;
  return `${newHeight + 5}px`;

}

