import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/user/quiz/get/?email=${cookies.email}`)
      .then((res) => {
        setQuizzes(res.data.data);
      });
  }, []);

  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Quizzes</h1>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 w-full bg-gray-700 text-white rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr className="text-gray-400 text-center">
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4">Score</th>
            <th className="py-2 px-4">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((problem, index) => (
            <tr key={index} className="border-t border-gray-700 text-center">
              <td className="py-2 px-4">
                {problem.status === "completed" && (
                  <i className="fas fa-check-circle text-green-400"></i>
                )}
              </td>
              <td className="py-2 px-4">
                <Link to={`/quiz/${problem.id}`} className="text-blue-500 underline hover:text-blue-700">
                  {problem.title}
                </Link>
              </td>
              <td className="py-2 px-4">{problem.score ? problem.score : "-"}</td>
              <td className={`py-2 px-4 ${problem.difficultyColor}`}>
                {problem.difficulty}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Quizzes;