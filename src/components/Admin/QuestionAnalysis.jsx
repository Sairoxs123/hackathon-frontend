import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useCookies } from "react-cookie";

const QuestionAnalysis = () => {
  const { id } = useParams();

  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  if (!cookies.admin_logged_in) {
    return window.location.href = "/admin/login"
  }
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/owner/question/analysis/?question_id=${id}`)
      .then((response) => {
        setCorrect(response.data.correct);
        setIncorrect(response.data.incorrect);
      });
  }, []);

  const chartData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        label: "Number of Students",
        data: [correct, incorrect],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8 text-center">Question Analysis</h1>

      {/* Chart Container */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2">
        <Bar data={chartData} />
      </div>

      {/* Percentage Display */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold">
          Percentage of Correct Answers:
        </h2>
        <p className="text-4xl font-bold text-green-600">
          {correct + incorrect > 0
            ? Math.round((correct / (correct + incorrect)) * 100)
            : 0}
          %
        </p>
      </div>
    </div>
  );
};

export default QuestionAnalysis;
