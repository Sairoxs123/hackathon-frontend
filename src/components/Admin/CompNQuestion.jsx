import React, { useState, useEffect } from "react";
import sendRequest from "../../utils/utils";

const CompNQuestion = () => {
  const [screen, setScreen] = useState("q");
  const [questions, setQuestions] = useState([]);
  const [comps, setComps] = useState([]);

  useEffect(() => {
    sendRequest("get", "/owner/qnc/get/").then((res) => {
      setQuestions(res.questions);
      setComps(res.competitions);
    });
  }, []);

  return (
    <div>
      <div className="flex justify-center">
        <button onClick={() => setScreen("q")}>Questions</button>
        <button onClick={() => setScreen("c")}>Competitions</button>
      </div>
      {screen == "q" ?
      <div>Questions</div>
      :
      <div>Competitions</div>}
    </div>
  );
};

export default CompNQuestion;
