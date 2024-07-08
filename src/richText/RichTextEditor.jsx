import React, {useState, useEffect, useRef} from 'react';
/**
 * Component: RichTextEditor.
 * text can be changed (and edit bar is rendered) if editable is true
 * reads/writes to a given firebaseDocPath. Loads the default RTE which currently is...
 * TipTapEditor
 * 
 * Props:
 * - value
 * - editable
 */

import {TipTap} from './TipTapEditor/TipTap'

export const RichTextEditor = ({
    user,
    editable,
    firebaseDocPath,
    content=""
  }) => {

  if(!firebaseDocPath) {
    return <>Missing firebasedocpath</>
  }

  return <TipTap
    firebaseDocPath={firebaseDocPath}
    editable={editable}
    user={user}
    content={content}
  />
};
