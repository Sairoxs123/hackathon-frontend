import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

const Submissions = () => {
  const { qid } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/question/submissions/${qid}/?email=${cookies.email}`
      )
      .then((res) => {
        console.log(res.data.submissions);
        setSubmissions(res.data.submissions);
      });
  }, []);

  const data = [
    {
      status: "Accepted",
      date: "Jul 04, 2024",
      runtime: "5728 ms",
      memory: "12.5 MB",
    },
    {
      status: "Accepted",
      date: "Oct 15, 2023",
      runtime: "5750 ms",
      memory: "14 MB",
    },
    {
      status: "Accepted",
      date: "Aug 04, 2023",
      runtime: "5796 ms",
      memory: "14.1 MB",
    },

  ];

  return (
    <div style={{ width: "50%", height: "95vh" }} className="bg-gray-900 text-white">
      <div className="p-4">
        <div className="grid grid-cols-3 text-gray-400 mb-2">
          <div>Status</div>
          <div>Runtime</div>
          <div>Memory</div>
        </div>
        {submissions.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-3 items-center py-2 border-b border-gray-700"
          >
            <div className="flex items-center">
              <span className="text-green-500">{item.correct ? "Accepted" : "Wrong"}</span>
              <span className="ml-4 text-gray-400">{item.submit_time}</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-clock mr-1"></i>
              <span>{item.time} ms</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-memory mr-1"></i>
              <span>{item.memory} kb</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Submissions;
