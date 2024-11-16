import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

const Quiz = () => {
  const { id } = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      image: null,
      options: [{ text: "", isCorrect: false, image: null }],
    },
  ]);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Store selected answers
  const [message, setMessage] = useState("");
  const parseQuestionsData = (data) => {
    return data.questions.map((question) => ({
      id: question.id,
      questionText: question.text,
      image: question.image == "No image" ? null : question.image,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text, // Get the option letter (A, B, C, etc.)
        isCorrect: option.is_correct, // Get the isCorrect value
        image: option.image == "No image" ? null : option.image,
      })),
    }));
  };

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/user/quiz/get/details/${id}/?type=user&email=${cookies.email}`
      )
      .then((response) => {
        if (response.data.message) {
          if (response.data.message == "class") {
            setMessage("This quiz was not assigned to your class.");
          } else if (response.data.message == "expired") {
            setMessage(
              `
              <div class="prose lg:prose-xl text-center">
                <h1 class="text-2xl font-bold text-gray-800">This quiz is not active right now.</h1>
                <a href="/quiz/${id}/results" class="inline-block px-4 py-2 mt-4 text-lg font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  See your results if you have taken this test before.
                </a>
              </div>

              `
            );
          } else if (response.data.message == "taken") {
            setMessage(
              `
              <div class="prose lg:prose-xl text-center">
                <h1 class="text-2xl font-bold text-gray-800">This quiz is single response and you have already taken it</h1>
                <a href="/quiz/${id}/results" class="inline-block px-4 py-2 mt-4 text-lg font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  See your results
                </a>
              </div>

              `
            );
          } else if (response.data.message == "grade") {
            setMessage("This quiz is not applicable for your grade.");
          }
        } else {
          setQuestions(parseQuestionsData(response.data.details[0]));
        }
      });
  }, []);

  const handleOptionChange = (questionId, optionId) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionId, // Store selected option for the question
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare data to send
    const formData = new FormData();
    formData.append("quiz_id", id); // Assuming you want to send the quiz ID
    formData.append("email", cookies.email); // Assuming you want to send user email

    // Add selected answers to formData
    for (const questionId in selectedAnswers) {
      formData.append(questionId, selectedAnswers[questionId]);
    }

    try {
      axios
        .post(
          "http://127.0.0.1:8000/user/quiz/submit/", // Replace with your API endpoint
          formData
        )
        .then((res) => {
          window.location.href = `/quiz/${id}/results`
        });
      // Handle successful submission (e.g., show a success message)
    } catch (error) {
      console.error("Error submitting quiz answers:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      {message.length == 0 ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Quiz</h2>
          {questions.map((question, index) => (
            <div key={index} className="mb-8">
              <p className="font-bold text-xl mb-4">Q{index + 1}:-</p>
              <div className="mb-4 flex w-full justify-center">
                {/* Center the image */}
                {question.image && (
                  <img
                    src={`http://127.0.0.1:8000${question.image}`}
                    alt="Question Image"
                    className="max-w-screen-xl w-full h-auto md:max-w-sm lg:max-w-md rounded-lg shadow-sm zoom"
                  />
                )}
              </div>
              <p className="font-bold text-xl mb-4">{question.questionText}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, oindex) => (
                  <label
                    key={oindex}
                    htmlFor={`option-${option.id}`}
                    className="w-full border border-gray-300 p-4 rounded-lg flex items-center cursor-pointer hover:bg-gray-100"
                  >
                    <input
                      type="radio"
                      id={`option-${option.id}`}
                      name={`question-${question.id}`}
                      value={option.id}
                      className="mr-4"
                      onChange={() =>
                        handleOptionChange(question.id, option.id)
                      } // Call when option changes
                      required
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
          <div className="w-full text-center">
            {/* Center the button and make it full width */}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
              Submit
            </button>
          </div>
        </form>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: message }}
          className="prose lg:prose-xl text-center"
        />
      )}
    </div>
  );
};

export default Quiz;
