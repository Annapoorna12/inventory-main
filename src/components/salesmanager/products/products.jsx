import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  Stack,
  Dialog,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Avatar,
} from "@mui/material";
import ServiceURL from "../../../constants/url";
import { toast } from "react-toastify";

import AddProduct from "./add";
import EditProduct from "./EditProduct";

export default function Products() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]); // State for filtered rows
  const [openDialog, setOpenDialog] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = () => {
    axios
      .get(`${ServiceURL}/admin/listProducts`)
      .then((response) => {
        setRows(response.data);
        setFilteredRows(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const UserStatusUpdate = (data) => {
    axios.put(`${ServiceURL}/admin/upateProductStatus`, { data })
    .then(response => {
      toast.success(response.data.message, { position: "top-right" });
      fetchData();
    })
    .catch(error => {
      console.error("Error fetching users:", error);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    filterRows(event.target.value); // Call filterRows with the new search query
  };

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const filterRows = (query) => {
    const filtered = rows.filter((row) => {
      return (
        row.Name.toLowerCase().includes(query.toLowerCase()) ||
        row.Price.toLowerCase().includes(query.toLowerCase()) ||
        row.Description.toLowerCase().includes(query.toLowerCase()) ||
        row.ExpiryDate.includes(query)
      );
    });
    setFilteredRows(filtered);
  };

  const sortedRows = filteredRows.sort((a, b) => {
    if (sortCriteria === "name") {
      return a.Name.localeCompare(b.Name);
    } else if (sortCriteria === "price") {
      return a.Price - b.Price;
    } else if (sortCriteria === "quantity") {
      return a.Quantity - b.Quantity;
    }
  });

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

  const handleEditClick = (product) => {
    setEditedCustomer(product);
    setOpenDialog(true);
  };

  const handleApprove = (product) => {
    // Implement approve functionality
  };

  const handleReject = (product) => {
    // Implement reject functionality
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extract date portion
  };

  const isExpired = (expiryDate) => {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    return expiry < currentDate;
  };

  return (
    <TableContainer>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom>
          Products
        </Typography>
        {/* Sort options select field */}
        <TextField placeholder="Search by name" onChange={handleSearch} />
        <FormControl variant="outlined">
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            value={sortCriteria}
            onChange={handleSortChange}
          >
            <MenuItem value="" defaultChecked={true}>
              None
            </MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="quantity">Quantity</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleOpenDialog}>
          Add Product
        </Button>
      </Stack>
      {filteredRows.length === 0 ? (
        <Table sx={{ minWidth: 1000 }} aria-label="custom pagination table">
          <Typography
            variant="body1"
            align="center"
            style={{ color: rows.length > 0 ? "black" : "red" }} // Apply red color if there are no filtered rows
          >
            {rows.length > 0 ? "No filtered data" : "No data"}
          </Typography>
        </Table>
      ) : (
        <Table sx={{ minWidth: 1000 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Image</TableCell>
              <TableCell align="center">Expiry Date</TableCell>
              <TableCell align="center">Product Status</TableCell>              
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? sortedRows.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : sortedRows
            ).map((row) => (
              <TableRow key={row.ProductID}>
                <TableCell style={{ width: 160 }} align="center">
                  {row.Name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.Description}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.Price}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.Quantity}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                    <Avatar
                    alt="Rounded Image"
                    src={`../../../../src/uploads/${row.productImage}`}
                    variant="rounded"
                    sx={{ width: 100, height: 100 }}
                  />
                </TableCell>
                <TableCell
                  style={{ width: 160, color: isExpired(row.ExpiryDate) ? "red" : "inherit" }} // Apply red color if expired
                  align="center"
                >
                  {formatDate(row.ExpiryDate)} {/* Format the expiry date */}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                <Typography variant="body2" style={{ color: row.product_status === 1 ? 'green' : 'red' }}>
                  {row.product_status === 1 ? 'Active' : 'Inactive'}
                </Typography>
              </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  <Button
                    variant="contained"
                    onClick={() => handleEditClick(row)}
                  >
                    Edit
                  </Button>
                  
                  {row.product_approve_status === 0 && (
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApprove(row)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleReject(row)}
                      >
                        Reject
                      </Button>
                    </Stack>
                  )}
                </TableCell>
                <TableCell>
                    <Switch
                      onChange={() => UserStatusUpdate(row)}
                      checked={row.product_status === 1}
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
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            colSpan={3}
            count={sortedRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Table>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {editedCustomer ? (
          <EditProduct
            editedProduct={editedCustomer}
            fetchData={fetchData}
            onClose={handleCloseDialog}
          />
        ) : (
          <AddProduct
            onClose={handleCloseDialog}
            open={openDialog}
            fetchData={fetchData}
          />
        )}
      </Dialog>
    </TableContainer>
  );
}
