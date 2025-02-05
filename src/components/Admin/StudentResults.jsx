import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const StudentResults = () => {
  const { id, quiz_id, email } = useParams();
  const [result, setResult] = useState({});
  const [score, setScore] = useState("");
  const [multiple, setMultiple] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  if (!cookies.admin_logged_in) {
    return window.location.href = "/admin/login"
  }


  const formatDate = (dateString) => {
    // Create a new Date object from the date string
    const date = new Date(dateString);

    // Options for formatting
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);

    // Get hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes to be two digits
    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

    // Combine date and time
    return `${formattedDate}, ${formattedTime}`;
};


  const parseMultiple = (data) => {
    let questions = [];
    data.questions.forEach((item, index) => {
      questions.push(parseQuestionsData([item])[0]);
    });
    return { score: data.score, questions: questions };
  };

  const parseQuestionsData = (data) => {
    return data.map((question) => ({
      id: question.id,
      questionText: question.question,
      image: question.image == "No image" ? null : question.image,
      submit_time: question.submit_time,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text, // Get the option letter (A, B, C, etc.)
        isCorrect: option.is_correct, // Get the isCorrect value
        image: option.image == "No image" ? null : option.image,
        selected: option.selected,
      })),
    }));
  };

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/user/quiz/get/results/?quiz_id=${id}&email=${email}`
      )
      .then((response) => {
        if (response.data.multiple) {
          setResult({});
          setMultiple(true);
          const data = response.data.data;
          data.forEach((item, index) => {
            const key = Object.keys(item)[0];
            const value = item[key];
            setResult((prev) => ({
              ...prev,
              [key]: parseMultiple(value),
            }));
          });
        } else {
          setResult(parseQuestionsData(response.data.data));
          setScore(response.data.score);
          setMultiple(false);
        }
      });
  }, []);

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-8 text-center">Quiz Results</h2>
      {multiple === false ? (
        <>
          <p className="text-2xl font-bold mb-4 text-center">
            Your Score: <span className="text-green-600">{score}</span>
          </p>
          <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2">
            {result &&
              result.map((question, index) => (
                <div key={index} className="mb-8">
                  <div className="flex justify-between">
                    <p className="font-bold text-xl mb-4">Q{index + 1}:-</p>
                    <Link to={`/admin/quiz/question/${question.id}`} >View Question Analysis</Link>
                  </div>
                  <div className="mb-4 flex w-full justify-center">
                    {question.image && (
                      <img
                        src={`http://127.0.0.1:8000${question.image}`}
                        alt="Question Image"
                        className="max-w-screen-xl w-full h-auto md:max-w-sm lg:max-w-md rounded-lg shadow-sm zoom"
                      />
                    )}
                  </div>
                  <p className="font-bold text-xl mb-4">
                    {question.questionText}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((option, oindex) => (
                      <label
                        key={oindex}
                        htmlFor={`option-${option.id}`}
                        className={`w-full border border-gray-300 p-4 rounded-lg flex items-center cursor-pointer ${
                          option.selected && option.isCorrect
                            ? "bg-green-200"
                            : option.selected
                            ? "bg-red-200"
                            : option.isCorrect
                            ? "bg-green-200"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <input
                          type="radio"
                          id={`option-${option.id}`}
                          name={`question-${question.id}-${oindex}`}
                          value={option.id}
                          className="mr-4"
                          disabled
                          checked={option.selected}
                        />
                        <div className="flex items-center w-max">
                          {option.image && (
                            <img
                              src={`http://127.0.0.1:8000${option.image}`}
                              alt="Option Image"
                              className="w-20 h-auto mr-1 rounded-lg shadow-sm zoom"
                            />
                          )}
                          <span className="text-lg">{option.text}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          {Object.entries(result).map(([key, value], index) => {
            return (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2 mb-4">
              <h1 className="font-bold text-3xl mb-4 text-center text-blue-600">Quiz Submitted on {formatDate(key)}</h1>
              <h1 className="font-bold text-2xl mb-4 text-center text-green-600">Score: <span className="text-green-600">{value.score}</span></h1>
              {value.questions.map((question, index) => (
              <div key={index} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                <p className="font-bold text-xl">Q{index + 1}:</p>
                <Link to={`/admin/quiz/question/${question.id}`} className="text-blue-500 hover:underline">View Question Analysis</Link>
                </div>
                <div className="mb-4 flex w-full justify-center">
                {question.image && (
                  <img
                  src={`http://127.0.0.1:8000${question.image}`}
                  alt="Question Image"
                  className="max-w-screen-xl w-full h-auto md:max-w-sm lg:max-w-md rounded-lg shadow-sm zoom"
                  />
                )}
                </div>
                <p className="font-bold text-xl mb-4">
                {question.questionText}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, oindex) => (
                  <label
                  key={oindex}
                  htmlFor={`option-${option.id}`}
                  className={`w-full border border-gray-300 p-4 rounded-lg flex items-center cursor-pointer ${
                    option.selected && option.isCorrect
                    ? "bg-green-200"
                    : option.selected
                    ? "bg-red-200"
                    : option.isCorrect
                    ? "bg-green-200"
                    : "hover:bg-gray-100"
                  }`}
                  >
                  <input
                    type="radio"
                    id={`option-${option.id}`}
                    name={`question-${question.id}-${oindex}`}
                    value={option.id}
                    className="mr-4"
                    disabled
                    checked={option.selected}
                  />
                  <div className="flex items-center w-max">
                    {option.image && (
                    <img
                      src={`http://127.0.0.1:8000${option.image}`}
                      alt="Option Image"
                      className="w-20 h-auto mr-1 rounded-lg shadow-sm zoom"
                    />
                    )}
                    <span className="text-lg">{option.text}</span>
                  </div>
                  </label>
                ))}
                </div>
              </div>
              ))}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default StudentResults;
