import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const Layout = ({ children, code, setCode, setLastKeypress, setSaved }) => {

  const handleEditorChange = (value) => {
    setCode(value);
    setLastKeypress(Date.now()); // update the last keypress timestamp
    setSaved(false);
  };

  if (children) {
    console.log(children);
  }

  let { qid } = useParams();

  return (
    <div>
      <div>
        {/*Link to={`/question/${qid}/solutions`}>Solutions</Link>*/}
        <Link to={`/question/${qid}/`}>Question</Link>
        <Link to={`/question/${qid}/submissions`}>Submissons</Link>
      </div>
      <div style={{ display: "flex" }}>
        {children}
        <Editor
          height="95vh"
          width={`50%`}
          language="python"
          value={code}
          theme="vs-dark"
          defaultValue="# Type here"
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
};

export default Layout;
