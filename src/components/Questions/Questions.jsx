import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const Questions = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [questions, setQuestions] = useState();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/questions/get?name${cookies.name}`)
      .then((res) => {
        setQuestions(JSON.parse(res.data.questions));
      });
  });

  return (
    <div>
      <h1>Questions</h1>
      <table>
        <tr>
          <th>No.</th>
          <th>Title</th>
          <th>Difficulty</th>
          <th>Completed</th>
        </tr>
        {questions.map((index, item) => {
          return (
            <tr>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.difficulty}</td>
              <td>{item.completed == true ? "Yes" : "No"}</td>
            </tr>
          )
        })}
      </table>
    </div>
  );
};

export default Questions;
