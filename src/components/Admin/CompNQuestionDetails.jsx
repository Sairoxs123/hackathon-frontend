import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import sendRequest from "../../utils/utils";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const CompNQuestionDetails = () => {
  const { type, id } = useParams();
  const [question, setQuestion] = useState("");
  const [inputs, setInputs] = useState("");
  const [outputs, setOutputs] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [points, setPoints] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [screen, setScreen] = useState("results");
  const [results, setResults] = useState([]);
  const formatDateTimeForInput = (dateTime) => {
    const date = new Date(dateTime);
    const localDateTime = date.toISOString().slice(0, 16); // Get the first 16 characters (YYYY-MM-DDTHH:MM)
    return localDateTime;
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
    sendRequest(
      "get",
      `/owner/qnc/get/details/?${
        type == "q" ? `id=${id}` : `session_code=${id}`
      } `
    ).then((res) => {
      setQuestion(res.question);
      setInputs(res.inputs);
      setOutputs(res.outputs);
      setDifficulty(res.difficulty);
      setPoints(res.points);
      setStart(res.start);
      setEnd(res.end);
      setResults(res.results);
    });
  }, []);

  const columns = [
    { field: 'user', headerName: 'Name', width: 450 },
    { field: 'class', headerName: 'Class', width: 450 },
    { field: 'submit_time', headerName: 'Submit Time', width: 450, valueFormatter: (params) => formatDate(params) }
  ];
  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div className="p-4">
      <div className="flex w-full bg-gray-100 rounded-lg p-2 mb-4">
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
            {
              /*
              <button
              onClick={deleteSubmissions}
              className="px-4 ml-1 mb-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Delete Submissions
            </button>
              */
            }
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
                onRowClick={() => console.log(true)}
              />
            </Paper>
          </div>
        ) : (
          <div className="flex flex-col items-center p-1">
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="quizTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Question:
                </label>
                <textarea
                  id="quizTitle"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  required
                  className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>


              {type == "c" ?
              <>
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
                    value={formatDateTimeForInput(start)}
                    onChange={(event) => setStart(event.target.value)}
                    required
                    className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

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
                    value={formatDateTimeForInput(end)}
                    onChange={(event) => setEnd(event.target.value)}
                    required
                    className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div></>
                : null}

              <div>
                <label
                  htmlFor="inputs"
                  className="block text-sm font-medium text-gray-700"
                >
                  Inputs:
                </label>
                <input
                  type="text"
                  id="inputs"
                  value={inputs}
                  onChange={(event) => setInputs(event.target.value)}
                  required
                  className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="outputs"
                  className="block text-sm font-medium text-gray-700"
                >
                  Outputs:
                </label>
                <input
                  type="text"
                  id="outputs"
                  value={outputs}
                  onChange={(event) => setOutputs(event.target.value)}
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
                  onChange={(event) => setDifficulty(event.target.value)}
                  required
                  className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="points"
                  className="block text-sm font-medium text-gray-700"
                >
                  Points:
                </label>
                <input
                  type="number"
                  id="points"
                  value={points}
                  onChange={(event) => setPoints(event.target.value)}
                  required
                  className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="px-4 ml-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Update Quiz
              </button>
              <button
                type="button"
                className="px-4 ml-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                //onClick={handleDelete}
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

export default CompNQuestionDetails;
