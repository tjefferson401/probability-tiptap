import React from 'react'
import ReactDOM from 'react-dom/client'
import PyodideProvider from './pyodide/PyodideProvider.jsx'
import { router } from './App.jsx'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <PyodideProvider>
    <RouterProvider
      router={router}
    />
    </PyodideProvider>
  /* </React.StrictMode> */
)
