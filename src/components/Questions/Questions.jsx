import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from 'react-router-dom';

const Questions = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!cookies.logged_in) {
      return (window.location.href = "/login");
    } else {
      axios
        .get(`http://127.0.0.1:8000/questions/get/?name=${cookies.name}`)
        .then((res) => {
          setQuestions(res.data.questions);
        });
    }
  }, []);

  return (
    <div className="bg-white">
      <center>
        <u>
          <h1 className="text-2xl">Questions</h1>
        </u>
      </center>
      <table width="100%">
        <tr className="underline">
          <th>No.</th>
          <th>Title</th>
          <th>Difficulty</th>
          <th>Completed</th>
        </tr>
        {questions.map((item, index) => {
          return (
            <tr key={index}>
              <td align="center">{item.id}</td>
              <td align="center">
                <Link to={`/question/${item.id}`} className="underline">{item.title}</Link>
              </td>
              <td align="center">{item.difficulty}</td>
              <td align="center">{item.completed == true ? "Yes" : "No"}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default Questions;
