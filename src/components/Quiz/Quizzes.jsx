import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";

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


  const columns = [
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => {
        if (params.row.status) {
          return <i className="fas fa-check-circle text-green-400"></i>;
        } else {
          return null;
        }
      },
    },
    { field: "title", headerName: "Title", width: 800 },
    {
      field: "score",
      headerName: "Score",
      width: 200,
      renderCell: (params) => {
        if (params.row.score) {
          return params.row.score;
        } else {
          return "-";
        }
      },
    },
    {
      field: "difficulty",
      headerName: "Difficulty",
      width: 300,
      renderCell: (params) => {
        return (
          <div className={params.row.difficultyColor}>
            {params.row.difficulty}
          </div>
        );
      },
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div className="overflow-x-auto">
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={quizzes}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 15, 25, 50, 100]}
          sx={{
            "& .MuiDataGrid-cell": {
              fontSize: 16, // Adjust the font size as needed
            },
          }}
          onRowClick={(params) =>
            (window.location.href = `quiz/${params.row.id}`)
          }
        />
      </Paper>
    </div>
  );
};

export default Quizzes;
