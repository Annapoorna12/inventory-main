import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, Button, Stack, Dialog, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddCategory from './addcategory';
import Editcategory from './Editcategory';
import ServiceURL from '../../../constants/url';
import Switch from 'react-switch';
import { toast } from "react-toastify";

export default function CategoryDetails() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]); // State for filtered rows
  const [openDialog, setOpenDialog] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [sortOption, setSortOption] = useState(""); // State for selected sorting option

  const fetchData = () => {
    axios.get(`${ServiceURL}/admin/categories`)
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query state
    filterRows(event.target.value); // Call filterRows with the new search query
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value); // Update selected sorting option
    sortRows(event.target.value); // Call sortRows with the new sorting option
  };

  const filterRows = (query) => {
    // Filter rows based on search query
    const filtered = rows.filter(row => {
      return row.CategoryName.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredRows(filtered); // Update filteredRows state with filtered rows
  };

  const sortRows = (option) => {
    let sorted = [...filteredRows]; // Create a copy of filteredRows
    if (option === "CategoryName") {
      sorted.sort((a, b) => a.CategoryName.localeCompare(b.CategoryName));
    } else if (option === "ActiveStatus") {
      sorted.sort((a, b) => a.CategoryStatus - b.CategoryStatus);
    }
    setFilteredRows(sorted); // Update filteredRows state with sorted rows
  };

  const CategoryStatusUpdate = (data) => {
    axios.put(`${ServiceURL}/admin/UpdateCategoryStatus`,{data})
    .then(response => {
      toast.success(response.data.message, {
        position: "top-right"
      });
      fetchData();
    })
    .catch(error => {
      console.error("Error fetching users:", error);
    });
  }

  return (
    <TableContainer>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Categories
        </Typography>
        <Button variant="contained" onClick={handleOpenDialog}>
         New Categories
        </Button>
        {/* Search Input Field */}
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {/* Select for Sorting */}
        <FormControl variant="outlined">
          <InputLabel htmlFor="sort-option">Sort By</InputLabel>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            label="Sort By"
            inputProps={{
              name: 'sortOption',
              id: 'sort-option',
            }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="CategoryName">Category Name</MenuItem>
            <MenuItem value="ActiveStatus">Active Status</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Table sx={{ minWidth: 100 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell align="center">CategoryName</TableCell>
            <TableCell align="center">Active Status</TableCell> 
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Use filteredRows instead of rows
            : filteredRows
          ).map((row) => (
            <TableRow key={row.FullName}>
              <TableCell style={{width: 160 }} align="center">
                {row.CategoryName}
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                <Typography variant="body1" style={{ color: row.CategoryStatus === 1 ? 'green' : 'red' }}>
                  {row.CategoryStatus === 1 ? 'Active' : 'Inactive'}
                </Typography>
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                <Button variant="contained" onClick={() => handleEditClick(row)}>Edit</Button>
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                  <Switch
                    onChange={() => CategoryStatusUpdate(row)}
                    checked={row.CategoryStatus === 1}
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
          count={filteredRows.length} // Use filteredRows.length instead of rows.length
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Table>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {editedCustomer ? (
          <Editcategory
            editedCategory={editedCustomer}
            fetchData={fetchData}
            onClose={handleCloseDialog}
          />
        ) : (
          <AddCategory onClose={handleCloseDialog} open={openDialog} fetchData={fetchData}/>
        )}
      </Dialog>
    </TableContainer>
  );
}
