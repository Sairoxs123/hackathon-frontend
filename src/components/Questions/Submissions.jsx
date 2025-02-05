import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Modal from "react-modal";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";

const Submissions = ({ code }) => {
  const { qid } = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [submissions, setSubmissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/question/submissions/${qid}/?email=${cookies.email}`
      )
      .then((res) => {
        console.log(res.data.submissions);
        setSubmissions(res.data.submissions);
      });
  }, [qid, cookies.email]);

  const handleRowClick = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  return (
    <div
      style={{ width: "50%", height: "95vh" }}
      className="bg-gray-900 text-white"
    >
      <div className="p-4">
        <div className="grid grid-cols-3 text-gray-400 mb-2">
          <div>Status</div>
          <div>Runtime</div>
          <div>Memory</div>
        </div>
        {submissions.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-3 items-center py-2 border-b border-gray-700 cursor-pointer"
            onClick={() => handleRowClick(item)}
          >
            <div className="flex items-center">
              <span className="text-green-500">
                {item.correct ? "Accepted" : "Wrong"}
              </span>
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Submission Details"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedSubmission && (
          <div className="p-6 bg-gray-800 text-white rounded-lg max-w-3xl mx-auto">
            <h2 className="text-2xl mb-4 font-bold">Submission Details</h2>
            <div className="mb-4">
              <p className="mb-2">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    selectedSubmission.correct
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {selectedSubmission.correct ? "Accepted" : "Wrong"}
                </span>
              </p>
              <p className="mb-2">
                <strong>Submit Time:</strong> {selectedSubmission.submit_time}
              </p>
              <p className="mb-2">
                <strong>Runtime:</strong> <i className="fas fa-clock mr-1"></i> {selectedSubmission.time} ms
              </p>
              <p className="mb-2">
                <strong>Memory:</strong> <i className="fas fa-memory mr-1"></i> {selectedSubmission.memory} kb
              </p>
            </div>
            <Editor
              height="300px"
              width="100%"
              language="python"
              value={selectedSubmission.code}
              theme="vs-dark"
              options={{ readOnly: true, minimap: { enabled: false } }} // Disable minimap for cleaner look
            />
            <div className="flex justify-center mt-6">
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-6 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Submissions;
