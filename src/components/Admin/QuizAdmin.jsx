import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

const QuizAdmin = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  if (!cookies.admin_logged_in) {
    return window.location.href = "/admin/login"
  }

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/owner/quiz/get/").then((res) => {
      setQuizzes(res.data.quizzes);
    });
  }, []);

  return (
    <div className="p-4">
      <Link to="/admin/quiz/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-4 inline-block">
        Create Quiz
      </Link>
      {typeof quizzes === "string" ? (
        <h1 className="text-center text-xl font-bold">{quizzes}</h1>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((item, index) => (
            <Link
              to={`/admin/quiz/details/${item.id}`}
              key={index}
              className="block p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h1 className="text-lg font-semibold">{item.title}</h1>
              <p className="text-gray-600">
                Active Status: {item.active ? "Active" : "Inactive"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizAdmin;