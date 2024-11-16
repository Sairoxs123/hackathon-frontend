import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const Solutions = () => {
  const { qid } = useParams();
  const [solutions, setSolutions] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/question/solutions/${qid}/?email=${cookies.email}`)
      .then((res) => {
        setSolutions(res.data.solutions);
      });
  }, []);

  return (
    <div style={{ width: "50%", height: "95vh" }}>
      {solutions.map((item, index) => {
        return (
          <div key={index}>
            <span>{item.id}</span>
            <span>{item.user}</span>
            <span>{item.memory}</span>
            <span>{item.time}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Solutions;
