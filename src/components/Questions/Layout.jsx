import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const Layout = ({ children, code, setCode, setLastKeypress, setSaved }) => {
  const handleEditorChange = (value) => {
    setCode(value);
    setLastKeypress(Date.now());
    setSaved(false);
  };

  let { qid } = useParams();

  const [batteryLevel, setBatteryLevel] = useState(null);

  useEffect(() => {
    if (navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        setBatteryLevel(battery.level * 100);

        battery.addEventListener("levelchange", () => {
          setBatteryLevel(battery.level * 100);
        });
      });
    }
  }, []);


  return (
    <div>
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Using Link tags for better UX with client-side routing  */}
          <Link to={`/question/${qid}/`} className="text-white hover:text-gray-300">Question</Link>
          <Link to={`/question/${qid}/submissions`} className="text-white hover:text-gray-300 submissions">Submissions</Link>
          {/*Example solutions link, uncomment if needed*/}
          {/* <Link to={`/question/${qid}/solutions`} className="text-white hover:text-gray-300">Solutions</Link> */}
        </div>

        <div className="text-white">
        {batteryLevel !== null && ( // Conditionally render battery info
          <div className="flex items-center space-x-2 text-white"> {/* More Tailwind */}
            <i className="fas fa-battery-full text-yellow-400"></i> {/* Battery icon */}
             {/* Use battery charging icon when charging */}
            <span>{Math.round(batteryLevel)}%</span>
          </div>
        )}
        </div>
      </nav>


      <div className="flex">
        {children}
        <Editor
          height="95vh"
          width={`50%`}
          language="python"
          value={code}
          theme="vs-dark"
          defaultValue="# Type here"
          onChange={handleEditorChange}
          className="editor"
        />
      </div>
    </div>
  );
};

export default Layout;
