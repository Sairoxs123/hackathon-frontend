import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import sendRequest from "../../utils/utils";

const QuizDetails = () => {
  const { id } = useParams();
  const [screen, setScreen] = useState("results");
  const [results, setResults] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [grade, setGrade] = useState(""); // New state for grade
  const [section, setSection] = useState(""); // New state for section
  const [questions, setQuestions] = useState([
    {
      id:null,
      questionText: "",
      image: null,
      options: [{ id:null,  text: "", isCorrect: false, image: null }], // Start with one option
      // No separate correctOption index anymore
    },
  ]);
  const [isMultiCorrect, setIsMultiCorrect] = useState(false); // Global state
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  if (!cookies.admin_logged_in) {
    return window.location.href = "/admin/login"
  }


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

  useEffect(() => {
    sendRequest("get", `/owner/quiz/get/responses/${id}/`)
      .then((res) => {
        console.log(res.submissions);
        setResults(res.submissions);
        console.log(res.submissions)
      });
  }, []);

  const formatDateTimeForInput = (dateTime) => {
    const date = new Date(dateTime);
    const localDateTime = date.toISOString().slice(0, 16); // Get the first 16 characters (YYYY-MM-DDTHH:MM)
    return localDateTime;
  };


  useEffect(() => {
    sendRequest("get", `/owner/quiz/get/details/${id}/`)
    .then((res) => {
      setQuizTitle(res.details[0].title)
      setGrade(res.details[0].grade) // Set grade
      setSection(res.details[0].section) // Set section
      setIsMultiCorrect(!res.details[0].single_submit)
      setDifficulty(res.details[0].difficulty)
      if (res.details[0].single_submit == true){
        setStartDateTime(formatDateTimeForInput(res.details[0].start_time));
        setEndDateTime(formatDateTimeForInput(res.details[0].end_time));
        setSection(res.details[0].section)
      }
      setQuestions(parseQuestionsData(res.details[0]))
    })
  }, [])

  const handleMultiCorrectChange = () => {
    setIsMultiCorrect(!isMultiCorrect);
  };

  const handleCorrectOptionClick = (questionIndex, optionIndex) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              options: question.options.map(
                (option, j) =>
                  j === optionIndex
                    ? { ...option, isCorrect: !option.isCorrect } // Toggle selection
                    : isMultiCorrect
                    ? option
                    : { ...option, isCorrect: false } // For single-correct, unselect others
              ),
            }
          : question
      )
    );
  };

  const handleQuizTitleChange = (event) => {
    setQuizTitle(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };


  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };

  const handleSectionChange = (event) => {
    setSection(event.target.value);
  };

  const handleExistingQuestionChange = (qid, event) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === qid
          ? { ...question, questionText: event.target.value } // Update the questionText
          : question
      )
    );
  };

  const handleExistingImageChange = (qid, event) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === qid
          ? { ...question, image: event.target.files[0] } // Update the questionText
          : question
      )
    );
  };

  const handleExistingOptionChange = (questionId, optionId, event) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId
                  ? { ...option, text: event.target.value } // Update the text of the matching option
                  : option
              ),
            }
          : question
      )
    );
  };

  const handleExistingOptionImageChange = (questionId, optionId, event) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId
                  ? { ...option, image: event.target.files[0] } // Update the text of the matching option
                  : option
              ),
            }
          : question
      )
    );
  };

  const handleQuestionChange = (index, event) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = event.target.value;
    setQuestions(updatedQuestions);
  };

  const handleImageChange = (index, event) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].image = event.target.files[0];
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].text =
      event.target.value;
    setQuestions(updatedQuestions);
  };

  const handleOptionImageChange = (questionIndex, optionIndex, event) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].image = event.target.files[0];
    setQuestions(updatedQuestions);
  };


  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        image: null,
        options: [{ text: "", isCorrect: false, image: null }],
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({
      text: "",
      isCorrect: false,
      image: null,
    });
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleStartDateTimeChange = (event) => {
    setStartDateTime(event.target.value);
  };

  const handleEndDateTimeChange = (event) => {
    setEndDateTime(event.target.value);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData()
      data.append("quiz_id", id)
      sendRequest("post", `/owner/quiz/delete/`, data)
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", id)
    formData.append("title", quizTitle);
    formData.append("grade", grade); // Add grade to formData
    formData.append("single_submit", isMultiCorrect);
    formData.append("number_of_questions", questions.length);
    formData.append("difficulty", difficulty);
    if (!isMultiCorrect) {
      formData.append("start_datetime", startDateTime);
      formData.append("end_datetime", endDateTime);
      formData.append("section", section); // Add section to formData
    }

    questions.forEach((question, index) => {
      formData.append(`questions[${index}][text]`, question.questionText);
      if (question.image) {
        formData.append(`questions[${index}][image]`, question.image);
      }
      formData.append(`questions[${index}][id]`, question.id);
      formData.append(
        `questions[${index}][options][length]`,
        question.options.length
      );
      question.options.forEach((option, optionIndex) => {
        formData.append(
          `questions[${index}][options][${optionIndex}][text]`,
          option.text
        );
        formData.append(
          `questions[${index}][options][${optionIndex}][id]`,
          option.id
        );
        formData.append(
          `questions[${index}][options][${optionIndex}][isCorrect]`,
          option.isCorrect
        );
        if (option.image) {
          formData.append(
            `questions[${index}][options][${optionIndex}][image]`,
            option.image
          );
        }
      });
    });

    try {
      sendRequest("post",
        "/owner/quiz/update/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const deleteSubmissions = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData()
      data.append("quiz_id", id)
      sendRequest("post", `/owner/quiz/delete/submissions/`, data)
      .then((res) => {
        setResults([])
      })
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  }

  const columns = [
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'class', headerName: 'Class', width: 300 },
    { field: "score", headerName: "Score", width: 300 },
    { field: 'datetime', headerName: 'Submit Time', width: 300, valueFormatter: (params) => formatDate(params) }
  ];
  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div className="p-4">
      {" "}
      {/* Added padding to the main container */}
      <div className="flex w-full bg-gray-100 rounded-lg p-2 mb-4">
        {" "}
        {/* Added styling to the button container */}
        <button
          onClick={() => setScreen("results")}
          className={`w-1/2 py-2 text-lg font-medium rounded-lg mr-2
            ${
              screen === "results"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
        >
          Results
        </button>
        <button
          onClick={() => setScreen("edit")}
          className={`w-1/2 py-2 text-lg font-medium rounded-lg
            ${
              screen === "edit"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
        >
          Edit
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        {screen === "results" ? (
          <div className="overflow-x-auto">
            <button onClick={deleteSubmissions} className="px-4 ml-1 mb-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-300">Delete Submissions</button>
            <Paper sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={results}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 15, 25, 50, 100]}
                sx={{
                  '& .MuiDataGrid-cell': {
                    fontSize: 16, // Adjust the font size as needed
                  },
                }}
                onRowClick={(params) => window.location.href += params.row.email}
              />
            </Paper>
          </div>
        ) : (
          <div className="flex flex-col items-center p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="quizTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quiz Title:
                </label>
                <input
                  type="text"
                  id="quizTitle"
                  value={quizTitle}
                  onChange={handleQuizTitleChange}
                  required
                  className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-gray-700"
                >
                  Difficulty:
                </label>
                <input
                  type="text"
                  id="difficulty"
                  value={difficulty}
                  onChange={handleDifficultyChange}
                  required
                  className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="grade"
                  className="block text-sm font-medium text-gray-700"
                >
                  Grade:
                </label>
                <input
                  type="text"
                  id="grade"
                  value={grade}
                  onChange={handleGradeChange}
                  required
                  className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={isMultiCorrect}
                    onChange={handleMultiCorrectChange}
                  />
                  <span className="ml-2">Allow multiple quiz submissions.</span>
                </label>
              </div>

              {!isMultiCorrect && (
                <div>
                  <label
                    htmlFor="startDateTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date and Time:
                  </label>
                  <input
                    type="datetime-local"
                    id="startDateTime"
                    value={startDateTime}
                    onChange={handleStartDateTimeChange}
                    required
                    className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}

              {!isMultiCorrect && (
                <div>
                  <label
                    htmlFor="endDateTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date and Time:
                  </label>
                  <input
                    type="datetime-local"
                    id="endDateTime"
                    value={endDateTime}
                    onChange={handleEndDateTimeChange}
                    required
                    className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}

              {!isMultiCorrect && (
                <div>
                  <label
                    htmlFor="section"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Section:
                  </label>
                  <input
                    type="text"
                    id="section"
                    value={section}
                    onChange={handleSectionChange}
                    required
                    className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}

              {questions.map((question, questionIndex) => (
                <div
                  key={questionIndex}
                  className="border p-4 rounded-md shadow-md"
                >
                  <h2 className="text-xl font-semibold mb-2">
                    Question {questionIndex + 1}
                  </h2>
                  <div className="mb-2">
                    <label
                      htmlFor={`questionText-${questionIndex}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Question:
                    </label>
                    <textarea
                      id={`questionText-${questionIndex}`}
                      value={question.questionText}
                      onChange={(event) =>
                        question.id ? handleExistingQuestionChange(question.id, event) : handleQuestionChange(questionIndex, event)
                      }
                      required
                      className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="mb-2">
                    <label
                      htmlFor={`image-${questionIndex}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Image (optional):
                    </label>
                    {question.image ? <img src={`http://127.0.0.1:8000/${question.image}`} alt={`Image ${questionIndex}`} /> : null}
                    <input
                      type="file"
                      id={`image-${questionIndex}`}
                      accept="image/*"
                      onChange={(event) =>
                        question.id ? handleExistingImageChange(question.id, event) : handleImageChange(questionIndex, event)
                      }
                      className="mt-1 p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Options for the question */}
                  {/* Options for the question */}
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="mb-2 flex items-center space-x-2">
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(event) =>
                            option.id ? handleExistingOptionChange(question.id, option.id, event) : handleOptionChange(questionIndex, optionIndex, event)
                          }
                          className="mt-1 p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor={`optionImage-${questionIndex}-${optionIndex}`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Option Image (optional):
                        </label>
                        {option.image ? (
                          <img
                            src={`http://127.0.0.1:8000/${option.image}`}
                            alt={`Image ${questionIndex}-${optionIndex}`}
                            className="w-48 h-32 object-contain" // Added styling for the image
                          />
                        ) : null}
                        <input
                          type="file"
                          id={`optionImage-${questionIndex}-${optionIndex}`}
                          accept="image/*"
                          onChange={(event) =>
                            option.id ? handleExistingOptionImageChange(question.id, option.id, event) : handleOptionImageChange(questionIndex, optionIndex, event)
                          }
                          className="mt-1 p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCorrectOptionClick(questionIndex, optionIndex)}
                        className={`ml-2 px-3 py-1 rounded-md ${
                          option.isCorrect ? "bg-green-500 text-white" : "bg-gray-300"
                        }`}
                      >
                        {option.isCorrect ? "Correct" : "Mark as Correct"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeOption(questionIndex, optionIndex)}
                        className="ml-2 px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}


                  <button
                    type="button"
                    onClick={() => addOption(questionIndex)}
                    className="px-4 py-2 bg-gray-400 text-gray-700 rounded-md hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Add Option
                  </button>

                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="px-4 py-2 ml-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Remove Question
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Add Question
              </button>

              <button
                type="submit"
                className="px-4 ml-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Update Quiz
              </button>
              <button
                type="button"
                className="px-4 ml-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={handleDelete}
              >
                Delete Quiz
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizDetails;
