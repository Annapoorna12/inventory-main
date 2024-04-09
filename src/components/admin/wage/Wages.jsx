import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, Button, Stack, Dialog, TextField } from '@mui/material';
import ServiceURL from '../../../constants/url';
import Switch from 'react-switch';
import { toast } from "react-toastify";


//modal dialog
import AddSupplier from './add';
import EditWage from "./EditWage";

export default function Wages() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]); // State for filtered rows


  const fetchData = () => {
    axios.get(`${ServiceURL}/admin/getwages`)
    .then(response => {
      setRows(response.data);
      setFilteredRows(response.data);
    })
    .catch(error => {
      console.error("Error fetching users:", error);
    });
  }

  useEffect(() => {  
    fetchData();
  }, []); 

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditedCustomer(null);
  };

  const handleEditClick = (customer) => {
    setEditedCustomer(customer); 
    setOpenDialog(true); 
  };


  const UserStatusUpdate = (data) => {
    axios.put(`${ServiceURL}/admin/UpdateUserStatus`, { data })
    .then(response => {
      toast.success(response.data.message, { position: "top-right" });
      fetchData();
    })
    .catch(error => {
      console.error("Error fetching users:", error);
    });
  }

  const filterRows = (query) => {
    const filtered = rows.filter(row => {
      return (
        row.FullName.toLowerCase().includes(query.toLowerCase()) ||
        row.timeperiod.toString().includes(query) ||
        row.workedHours.toString().includes(query) ||
        row.wageperHour.toString().includes(query) ||
        row.totalAmount.toString().includes(query)
      );
    });
    return filtered;
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  return (
    <TableContainer>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Wages
        </Typography>
        <TextField
          label="Search"
          variant="outlined"
          onChange={handleSearch}
        />
        <Button variant="contained" onClick={handleOpenDialog}>
          Add Wage 
        </Button>
      </Stack>
      {filteredRows.length === 0 ? ( 
        <Table sx={{ minWidth: 1000 }} aria-label="custom pagination table">
          <Typography variant="body1" align="center">No data</Typography>
        </Table>
      ) : (
        <Table sx={{ minWidth: 1000 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name of Employee</TableCell>
              <TableCell align="center">Wage Period</TableCell>
              <TableCell align="center">Worked Hours</TableCell>
              <TableCell align="center">Wage / Hours </TableCell>
              <TableCell align="center">Total Amount</TableCell> 
              <TableCell align="center"></TableCell> 
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filterRows(searchQuery).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filterRows(searchQuery)
            ).map((row) => (
              <TableRow key={row.FullName}>
                <TableCell style={{ width: 160 }} align="center">
                  {row.FullName}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.timeperiod}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.workedHours}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.wageperHour}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                {row.totalAmount}
              </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  <Button variant="contained" onClick={() => handleEditClick(row)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            colSpan={3}
            count={filterRows(searchQuery).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Table>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {editedCustomer ? (
          <EditWage
            editedWage={editedCustomer}
            fetchData={fetchData}
            onClose={handleCloseDialog}
          />
        ) : (
          <AddSupplier onClose={handleCloseDialog} open={openDialog} fetchData={fetchData}/>
        )}
      </Dialog>
    </TableContainer>
  );
}
