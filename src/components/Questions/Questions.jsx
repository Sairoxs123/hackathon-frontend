import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import { useCookies } from 'react-cookie';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [cookies] = useCookies(['email']);

  useEffect(() => {
    if (!localStorage.getItem('questions_tour')) {
      // Show tour
      localStorage.setItem('questions_tour', true);
    }
    axios
      .get(`http://127.0.0.1:8000/questions/get/?email=${cookies.email}`)
      .then((res) => {
        setQuestions(res.data.questions);
        console.log(res.data.questions);
      });
  }, [cookies.email]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'title', headerName: 'Title', width: 600 },
    {
      field: "difficulty",
      headerName: "Difficulty",
      width: 100,
      renderCell: (params) => {
        return (
          <div className={params.row.difficultyColor}>
            {params.row.difficulty}
          </div>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => {
        if (params.row.in_progress) {
          return <i className="fas fa-pencil-alt text-yellow-400"></i>;
        } else if (params.row.completed) {
          return <i className="fas fa-check-circle text-green-400"></i>;
        } else {
          return null;
        }
      },
    },
  ];

  const paginationModel = { page: 0, pageSize: 25 };

  return (
    <div className="overflow-x-auto">
      <Paper sx={{ height: "75vh", width: '70%', margin: 'auto', marginTop: '5%' }}>
        <DataGrid
          rows={questions}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 15, 25, 50, 100]}
          sx={{
            '& .MuiDataGrid-cell': {
              fontSize: 16, // Adjust the font size as needed
            },
          }}
          onRowClick={(params) => window.location.href = `question/${params.row.id}`}
        />
      </Paper>
    </div>
  );
};

export default Questions;