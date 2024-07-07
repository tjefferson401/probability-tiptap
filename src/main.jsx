import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { MathJaxContext } from 'better-react-mathjax'
import PyodideProvider from './pyodide/PyodideProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PyodideProvider>
    <MathJaxContext>
    <App />
    </MathJaxContext>
    </PyodideProvider>
  </React.StrictMode>,
)
