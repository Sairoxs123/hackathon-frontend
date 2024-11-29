import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';

function createData(id, title, difficulty, completed, in_progress) {
  return { id, title, difficulty, completed, in_progress };
}

function EnhancedTable(props) {
  const rows = props.questions.map((q) =>
    createData(q.id, q.title, q.difficulty, q.completed, q.in_progress)
  );

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('difficulty');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


    const visibleRows = React.useMemo(() => {
      let sortedRows = [...rows];

      if (orderBy === "title") {
        sortedRows.sort((a, b) => a.title.localeCompare(b.title));
      } else if (orderBy === "difficulty") {
        sortedRows.sort((a, b) => a.difficulty.localeCompare(b.difficulty));
      } else {
        sortedRows.sort(
          (a, b) =>
            (a.completed || a.in_progress) === (b.completed || b.in_progress)
              ? 0
              : a.completed || a.in_progress
              ? -1
              : 1
        );
      }

      if (orderBy === "difficulty") { // Filter based on difficulty sort direction
          if (order === 'asc') { // Easy to Hard
              sortedRows = sortedRows.filter(row => row.difficulty !== ""); //Optional: Remove questions with empty difficulty
          } else { // Hard to Easy
              sortedRows = sortedRows.filter(row => row.difficulty !== ""); //Optional: Remove questions with empty difficulty
          }
      }

      return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [order, orderBy, page, rowsPerPage, rows]);

const headCells = [
    {
      id: 'title',
      numeric: false,
      disablePadding: true,
      label: 'Title',
    },
    {
      id: 'difficulty',
      numeric: false,
      disablePadding: false,
      label: 'Difficulty',
    },
    {
      id: 'attempted',
      numeric: false,
      disablePadding: false,
      label: 'Attempted',
    },
  ];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      align="center"
                    >
                       <Link to={`/question/${row.id}`} className="text-blue-500 underline hover:text-blue-700">{row.title}</Link>
                    </TableCell>
                    <TableCell align="center">{row.difficulty}</TableCell>
                    <TableCell align="center">
                      {row.completed ? (
                        <i className="fas fa-check-circle text-green-400"></i>
                      ) : row.in_progress ? (
                        <i className="fas fa-pencil-alt text-yellow-400"></i>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}


const Questions = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!cookies.logged_in) {
      return (window.location.href = "/login");
    } else {
      if (!localStorage.getItem("questions_tour")) {
        localStorage.removeItem("questions_tour", true);
        const driverObj = driver();
        driverObj.highlight({
          element: ".select",
          popover: {
            title: "Questions",
            description:
              "Here you can see all the questions created by the teachers.",
          },
        });
        localStorage.setItem("questions_tour", true);
      }
      axios
        .get(`http://127.0.0.1:8000/questions/get/?email=${cookies.email}`)
        .then((res) => {
          setQuestions(res.data.questions);
        });
    }
  }, []);

  return (
    <div className="overflow-x-auto">
        <EnhancedTable questions={questions} />
    </div>
  );
};

export default Questions;
