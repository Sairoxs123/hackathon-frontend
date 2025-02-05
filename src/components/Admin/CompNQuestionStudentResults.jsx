import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sendRequest from "../../utils/utils";
import Editor from "@monaco-editor/react";

const CompNQuestionStudentResults = () => {
  const { id, email, type } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    sendRequest(
      "get",
      `/owner/qnc/get/submissions/?email=${email}&${
        type == "q" ? `q_id=${id}` : `session_code=${id}`
      }`
    ).then((res) => {
      setResults(res.results);
    });
  }, []);

  return (
    <div className="mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Student Results</h1>
      {results.map((item, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4 shadow-md">
          <div className="flex flex-col md:flex-row md:justify-center">
            <div
              className={`w-full md:w-1/2 m-1 p-4 rounded-lg font-bold text-3xl text-center shadow-md ${
                item.correct ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p className="font-semibold">
                Status:{" "}
                <span
                  className={`${
                    item.correct ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {item.correct ? "Correct" : "Incorrect"}
                </span>
              </p>
              <p>
                <span className="font-semibold">Execution Time:</span>{" "}
                {item.exec_time}ms
              </p>
              <p>
                <span className="font-semibold">Memory Used:</span> {item.memory}
                KB
              </p>
              <p>
                <span className="font-semibold">Submit Time:</span>{" "}
                {item.submit_time}
              </p>
            </div>
            <div className="w-full md:w-1/2 mt-4 md:mt-0 m-1">
              <Editor
                height="400px" // Adjust height as needed
                language="python"
                value={item.code}
                theme="vs-dark"
                options={{ readOnly: true, minimap: { enabled: false } }} // Disable minimap for cleaner look
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompNQuestionStudentResults;

