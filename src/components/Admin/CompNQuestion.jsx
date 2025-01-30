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
            <div className="flex w-full bg-gray-100 rounded-lg p-2 mb-4">
        <button
          onClick={() => setScreen("q")}
          className={`w-1/2 py-2 text-lg font-medium rounded-lg mr-2
            ${
              screen === "q"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
        >
          Questions
        </button>
        <button
          onClick={() => setScreen("c")}
          className={`w-1/2 py-2 text-lg font-medium rounded-lg
            ${
              screen === "c"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          tabIndex={1}
        >
          Competitions
        </button>
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
