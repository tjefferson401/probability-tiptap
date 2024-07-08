import  { useState, useEffect, useRef } from "react";



import { useDebounce } from "use-debounce";

import Swal from "sweetalert2";

// tiptap
import { useEditor, EditorContent, Extension, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

import { RunnableCode } from "./extensions/RunnableCode";
import { InlineTex } from "./extensions/InlineTex";
import { BlockTex } from "./extensions/BlockTex";
import { parseMathJax } from "./parser/latex";
import { ChartBlock } from "./extensions/Chart";

// yjs
import './TipTap.scss';
import { ButtonBar } from "./ButtonBar";

/**
 * Props:
 * editable: boolean. Can you edit the doc?
 * firebaseDocPath: string. Where in the firebase should we write the doc? We use our own
 *    format for this doc path, so I would recommend a doc that isn't used for anything else
 * onServerWrite: function with one parameter. An optional function which is called each time
 *    we write to the server. This can be used to do something like update a search index. It
 *    will be passed a JSON containing the content of the editor. Why use the JSON? If you
 *    want to highlight a found string in the editor, you will need the JSON format. Note, if
 *    you have multiple clients connected to the same document, only one of them will be in
 *    charge up updating the database.
 *
 *
 * TipTap is the *best* editor I have found. It is built off of ProseMirror, is
 * actively supported and just works so well. It also has principled support
 * for collaborative editing and for creating custom components.
 *
 * Collaboration:
 * Collaboration is built off the amazing yjs library. yjs can be backed by either
 * webrtc either serverlessly, or with a server. The server is the recommended option
 * however it doesn't work well with firebase. For the time being I am having the clients
 * take turns being the centralized server.
 * The "truth" is the webrtc yjs object. However this truth needs to be saved to the db
 * and loaded when a new editing room is created. Who should save? who should load?
 * The great idea is to use the following protocol:
 * whomever has the lowest sessionId is in charge of backing up to the firebase.
 * whomever is first to open the document is in charge of loading from the firebase.
 *
 * Loading / saving to the database:
 * Loading: set the editor content. This will propogate to future yjs connections
 * Saving: save the json of the editor content
 *
 * Notes on YJS and firebase:
 * https://github.com/yjs/yjs/issues/189
 *
 * I thought this conversation was very helpful:
 * https://discuss.yjs.dev/t/persisting-to-db-could-it-be-this-easy/358/3
 *
 * "awareness" is an important concept! Its used for things like...
 * knowing who else is online
 * keeping track of their cursor position etc
 *
 * Known issues:
 * - Cant drag/drop code
 */

export const TipTap = (props) => {

  const {
    editable
  } = props

  // this component is not (by default) reactive to
  // firebaseDocPath changing, or collaborative changing
  // if either of those change, we need to force react
  // to re-create this component. We do that by giving
  // the component a unique key based on the two components




  // force the component to un-mount if any of these change

  return <TipTapSafe {...props} key={`uniqueKey-${editable}`}/>

}

const TipTapSafe = ({
  editable,
    user,
    content=""
}) => {

  // listen to changes to the firebase document path

  return (
    <TipTapWithData
      editable={editable}
      user={user}
      content={content}
    />
  );
};

/**
 * Main job is to control multiple editors
 */
export const TipTapWithData = ({
  editable,
  user,
  content
}) => {

  // test cases
  const editableRef = useRef(editable)
  useEffect(() => {
    if(editableRef.current !== editable) {
      throw new Error("editable changed in TipTapSafe")
    }
  }, [ editable])

  let [webProvider, setWebProvider] = useState(null);

  // for writing to the firebase. ready changes are the json to save
  // which gets debounced to prevent too many writes.
  const [readyChanges, setReadyChanges] = useState(null);
  const [debouncedChanges] = useDebounce(readyChanges, 500);


  const onUpdate = (json, html, text) => {
    // the underlying json has changed
      setReadyChanges(json);
  };



  return (
    <TipTapWithDoc
      onUpdate={onUpdate}
      provider={webProvider}
      editable={editable}
      user={user}
      content={content}
    />
  );
};

/**
 * This is the actual editor
 */
const TipTapWithDoc = ({ provider, onUpdate, editable, user, content=""}) => {
  const [readyChanges, setReadyChanges] = useState(content);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // The Collaboration extension comes with its own history handling
        // (you don't undo other peoples changes)
        history: false,
      }),
      InlineTex,
      BlockTex,
      RunnableCode,
      ChartBlock,
      Placeholder.configure({
        placeholder: "Write something …",
      }),
      Image.configure({
        inline: false,
      }),
      // Register the document with Tiptap
    ],
    editable: editable,
    content: parseMathJax(content),
  });


  useEffect(() => {
    if(editor) {
      // set editor content
      editor.commands.setContent(parseMathJax(content));
    }
  }, [content])

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
      editor.chain().focus().insertContent("").run();
    }
  }, [editable]);

  useEffect(() => {
    if (!editor) return;
    editor.on("update", ({ editor }) => {
      let json = editor.getJSON();
      let html = editor.getHTML();
      let text = editor.getText();
      onUpdate(json, html, text);
    });
  }, [editor]);


  const onInsertImage = () => {
    Swal.fire({
      title: "Select image",
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your profile picture",
      },
    }).then((e) => {
      const file = e.value;
      // take the file, store it locally and then insert it
      // into the editor

      const reader = new FileReader();
      reader.onload = (e) => {
        insertImage(e.target.result);
      };
      reader.readAsDataURL(file);
      // get temporary url
      
      const url = URL.createObjectURL(file);
      insertImage(url);
    });
  };

  const insertImage = (imgUrl) => {
    editor.chain().focus().insertContent(`<img src="${imgUrl}"></img>`).run();
  };


  return (
    <div className="tiptapWrapper">
      <ButtonBar
        editor={editor}
        editable={editable}
        onInsertImage={onInsertImage}
      />
      <div 
        style={{minHeight: "800px"}}
        className={"tiptapContentWrapper " +(editable ? "editor editableWrapper" : "")}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
