import React, { useState } from 'react';
import axios from 'axios';

const QuizCreate = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [grade, setGrade] = useState(''); // New state for grade
  const [section, setSection] = useState(''); // New state for section
  const [difficulty, setDifficulty] = useState("")
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      image: null,
      options: [{ text: '', isCorrect: false, image:null }], // Start with one option
      // No separate correctOption index anymore
    },
  ]);
  const [isMultiCorrect, setIsMultiCorrect] = useState(false); // Global state
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');

  const handleMultiCorrectChange = () => {
    setIsMultiCorrect(!isMultiCorrect);
  };

  const handleCorrectOptionClick = (questionIndex, optionIndex) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              options: question.options.map((option, j) =>
                j === optionIndex
                  ? { ...option, isCorrect: true } // Mark the selected option as correct
                  : { ...option, isCorrect: false } // Unmark all other options
              ),
            }
          : question
      )
    );
  };

  const handleQuizTitleChange = (event) => {
    setQuizTitle(event.target.value);
  };

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };

  const handleSectionChange = (event) => {
    setSection(event.target.value);
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
        questionText: '',
        image: null,
        options: [{ text: '', isCorrect: false }],
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
      text: '',
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', quizTitle);
    formData.append('grade', grade); // Add grade to formData
    formData.append('single_submit', isMultiCorrect);
    formData.append('number_of_questions', questions.length);
    formData.append("difficulty", difficulty)

    if (!isMultiCorrect) {
      formData.append('start_datetime', startDateTime);
      formData.append('end_datetime', endDateTime);
      formData.append('section', section); // Add section to formData
    }

    questions.forEach((question, index) => {
        formData.append(`questions[${index}][text]`, question.questionText);
        if (question.image) {
            formData.append(`questions[${index}][image]`, question.image);
        }
        formData.append(`questions[${index}][options][length]`, question.options.length);
        question.options.forEach((option, optionIndex) => {
            formData.append(`questions[${index}][options][${optionIndex}][text]`, option.text);
            formData.append(`questions[${index}][options][${optionIndex}][isCorrect]`, option.isCorrect);
            if (option.image) {
                formData.append(`questions[${index}][options][${optionIndex}][image]`, option.image);
            }
        });
    });

    try {
        const response = await axios.post('http://127.0.0.1:8000/owner/quiz/create/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Quiz created:', response.data);
    } catch (error) {
        console.error('Error creating quiz:', error);
    }
};

  return (
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
          <label
            htmlFor="difficulty"
            className="block text-sm font-medium text-gray-700"
          >
            Difficulty:
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
            className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
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
          <div key={questionIndex} className="border p-4 rounded-md shadow-md">
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
                  handleQuestionChange(questionIndex, event)
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
              <input
                type="file"
                id={`image-${questionIndex}`}
                accept="image/*"
                onChange={(event) => handleImageChange(questionIndex, event)}
                className="mt-1 p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Options for the question */}
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="mb-2 flex items-center">
                <input
                  type="text"
                  value={option.text}
                  onChange={(event) =>
                    handleOptionChange(questionIndex, optionIndex, event)
                  }
                  className="mt-1 p-2 flex-grow border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="mb-2">
                  <label
                    htmlFor={`optionImage-${questionIndex}-${optionIndex}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Option Image (optional):
                  </label>
                  <input
                    type="file"
                    id={`optionImage-${questionIndex}-${optionIndex}`}
                    accept="image/*"
                    onChange={(event) =>
                      handleOptionImageChange(questionIndex, optionIndex, event)
                    }
                    className="mt-1 p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCorrectOptionClick(questionIndex, optionIndex)
                  }
                  className={`ml-2 px-3 py-1 rounded-md ${
                    option.isCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300'
                  }`}
                >
                  {option.isCorrect ? 'Correct' : 'Mark as Correct'}
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
              className="px-4 ml-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
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
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizCreate;
