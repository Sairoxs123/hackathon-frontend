import React, { useState, useEffect } from "react";
import sendRequest from "../../utils/utils";
import { Link } from "react-router-dom";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {questions.map((item, index) => (
        <Link
        to={`/admin/questions-competitions/details/q/${item.id}`}
          key={index}
          className="block p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <h1 className="text-lg font-semibold">{item.title}</h1>
        </Link>
      ))}
    </div>
      :
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comps.map((item, index) => (
            <Link
              to={`/admin/questions-competitions/details/c/${item.id}`}
              key={index}
              className="block p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h1 className="text-lg font-semibold">{item.title}</h1>
              <p className="text-gray-600">
                Active Status: {item.active ? "Active" : "Inactive"}
              </p>
            </Link>
          ))}
        </div>}
    </div>
  );
};

export default CompNQuestion;
