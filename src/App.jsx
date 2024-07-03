
// import PyodideProvider from './pyodide/PyodideProvider'
// import { RichTextEditor } from "./richText/RichTextEditor"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'katex/dist/katex.min.css'



// function App() {
//   /*
//   export const RichTextEditor = ({
//     user,
//     editable,
//     firebaseDocPath,
//     collaborative=true,
//     contentKey='content'
//   }) => {
//     */

//   return (
//     <>
//     <PyodideProvider>
//       <RichTextEditor
//         user={{name: 'test'}}
//         editable={true}
//         firebaseDocPath='test'
//         collaborative={false}
//         contentKey='content'
//       />
//     </PyodideProvider>
//     </>
//   )
// }

// export default App
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { FileDisplay } from './components/FileDisplay';

const fetchFileStructure = async () => {
    const response = await fetch('/fileStructure.json');
    return response.json();
};

const renderFileStructure = (setCurrFile, structure, basePath = '') => {
    return structure.map((item) => {
        if (item.type === 'directory') {
            return (
                <div key={basePath + item.name}>
                    <strong>{item.name}</strong>
                    <div style={{ marginLeft: '20px' }}>
                        {renderFileStructure(setCurrFile, item.children, `${basePath}${item.name}/`)}
                    </div>
                </div>
            );
        } else {
          if(! item.name.endsWith('.html')) {
            return null;
          }
            return (
                <div key={basePath + item.name}>
                    <button onClick={() => {
                      setCurrFile(basePath + item.name)
                    }}>
                        {item.name}
                    </button>
                </div>
            );
        }
    });
};

const FileStructure = ({setCurrFile}) => {
    const [structure, setStructure] = useState([]);

    useEffect(() => {
        const getStructure = async () => {
            const data = await fetchFileStructure();
            setStructure(data);
        };
        getStructure();
    }, []);

    return (
        <div>
            <h1>File Structure</h1>
            {renderFileStructure(setCurrFile, structure)}
        </div>
    );
};

const App = () => {
    // <Router>
    //     <div>
    //         <Routes>
    //             <Route exact path="/" component={FileStructure} />
    //             {/* Add other routes if needed */}
    //         </Routes>
    //     </div>
    // </Router>
    const [currFile, setCurrFile] = useState(null)


    if(!currFile) {
      return <FileStructure setCurrFile={setCurrFile} />
    }

    return <FileDisplay filePath={currFile} setCurrFile={setCurrFile} />
};

export default App;
