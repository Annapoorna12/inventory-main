import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, Button, Stack, Dialog, TextField } from '@mui/material';
import AddStaff from './add';
import EditCustomer from './EditEmployee';
import ServiceURL from '../../../constants/url';
import Switch from 'react-switch';
import { toast } from "react-toastify";

export default function Employee() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredRows, setFilteredRows] = useState([]); // State for filtered rows
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const fetchData = () => {
    axios.get(`${ServiceURL}/admin/Employeelist`)
    .then(response => {
      setRows(response.data);
      setFilteredRows(response.data); // Initialize filteredRows with all rows
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
        row.ContactNumber.toLowerCase().includes(query.toLowerCase()) ||
        row.Email.toLowerCase().includes(query.toLowerCase()) ||
        row.Address.toLowerCase().includes(query.toLowerCase())
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
          Employee
        </Typography>
        
        <Button variant="contained" onClick={handleOpenDialog}>
          New Employee
        </Button>
        <TextField
          label="Search"
          variant="outlined"
          onChange={handleSearch}
        />
      </Stack>
      {filteredRows.length === 0 ? ( 
        <Table sx={{ minWidth: 1000 }} aria-label="custom pagination table">
          <Typography variant="body1" align="center">No data</Typography>
        </Table>
      ) : (
        <Table sx={{ minWidth: 1000 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Contact Number</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Status</TableCell> 
              <TableCell align="center">Actions</TableCell> 
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
                  {row.ContactNumber}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.Email}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.Address}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                <Typography variant="body2" style={{ color: row.user_status === 1 ? 'green' : 'red' }}>
                  {row.user_status === 1 ? 'Active' : 'Inactive'}
                </Typography>
              </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  <Button variant="contained" onClick={() => handleEditClick(row)}>Edit</Button>
                </TableCell>
                <TableCell>
                    <Switch
                      onChange={() => UserStatusUpdate(row)}
                      checked={row.user_status === 1}
                    />
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
          <EditCustomer
            editedCustomer={editedCustomer}
            fetchData={fetchData}
            onClose={handleCloseDialog}
          />
        ) : (
          <AddStaff onClose={handleCloseDialog} open={openDialog} fetchData={fetchData}/>
        )}
      </Dialog>
    </TableContainer>
  );
}
