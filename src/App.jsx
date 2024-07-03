
import PyodideProvider from './pyodide/PyodideProvider'
import { RichTextEditor } from "./richText/RichTextEditor"
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  /*
  export const RichTextEditor = ({
    user,
    editable,
    firebaseDocPath,
    collaborative=true,
    contentKey='content'
  }) => {
    */

  return (
    <>
    <PyodideProvider>
      <RichTextEditor
        user={{name: 'test'}}
        editable={true}
        firebaseDocPath='test'
        collaborative={false}
        contentKey='content'
      />
    </PyodideProvider>
    </>
  )
}

export default App
