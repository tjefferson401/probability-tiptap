import React, { useState, useEffect, useRef } from "react";
import {
  FaAlignCenter,
  FaBold,
  FaHeading,
  FaImage,
  FaPython,
  FaSquareRootAlt,
  FaPaperPlane,
  FaCalculator
} from "react-icons/fa";

export const ButtonBar = ({ editor, editable, onInsertImage }) => {
    if (!editable) return <></>;
    return (
      <div
        className="d-flex"
        style={{
          top: "0",
          background: "white",
          border: "1px solid lightgrey",
          borderRadius: "5px 5px 0px 0px",
          maxWidth:'670px'
        }}
      >
  
        <BlockLatexButton editor={editor}/>
        <InlineLatexButton editor={editor}/>
        <PythonButton editor={editor}/>
        <ImageButton editor={editor} onInsertImage={onInsertImage}/>
        <ChartButton editor={editor}/>
        <PaperButton editor={editor}/>
        <CalcButton editor={editor}/>
        
  
      </div>
    );
  };
  
  
  
  function InlineLatexButton({editor}) {
    return <button onClick={() =>
      editor
        .chain()
        .focus()
        .insertContent("<inline-tex></inline-tex>")
        .run()
    } className="btn btn-sm btn-light">
  <FaSquareRootAlt /> Inline LaTeX
  </button>
  }
  
  function ImageButton({editor,onInsertImage}) {
    return <button onClick={() => onInsertImage()} className="btn btn-sm btn-light">
    <FaImage /> Image
  </button>
  }
  
  function PythonButton({editor}) {
    return <button
    onClick={() =>
      editor
        .chain()
        .focus()
        .insertContent("<runnable-code></runnable-code>")
        .run()
    }
    className="btn btn-sm btn-light "
  >
    <FaPython /> Python
  </button>
  }
  
  function BlockLatexButton({editor}) {
    return <button onClick={() => editor
      .chain()
      .focus()
      .insertContent("<block-tex></block-tex>")
      .run()} className="btn btn-sm btn-light">
      <FaAlignCenter /> Block LaTeX
    </button>;
  }

  function ChartButton({editor}) {
    return <button onClick={() =>
      editor
        .chain()
        .focus()
        .insertContent("<chart-block></chart-block>")
        .run()
    } className="btn btn-sm btn-light">
    <FaHeading /> Chart
  </button>
  }


  function PaperButton({editor}) {
    return <button onClick={() =>
      editor
        .chain()
        .focus()
        .insertContent("<paper></paper>")
        .run()
    } className="btn btn-sm btn-light">
    <FaPaperPlane /> Paper
  </button>
  }


  function CalcButton({editor}) {
    return <button onClick={() =>
      editor
        .chain()
        .focus()
        .insertContent("<simple-calculator></simple-calculator>")
        .run()
    } className="btn btn-sm btn-light">
    <FaCalculator /> Calc
    </button>
  }