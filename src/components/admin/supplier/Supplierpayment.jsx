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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import ServiceURL from "../../../constants/url";
import Switch from "react-switch";
import { toast } from "react-toastify";

// Modal dialog


export default function SupplierPayment() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [sortField, setSortField] = useState(""); // State for the selected sorting field
  const [sortOrder, setSortOrder] = useState("asc"); // State for sorting order
  const [rows, setRows] = useState([]);

  const fetchData = () => {
    axios
      .get(`${ServiceURL}/admin/PurchaseList`)
      .then((response) => {
        console.log(response.data);
        setRows(response.data.purchases);
        setFilteredRows(response.data.purchases);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

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

  const UpdatePaymentStatus = (data) => {
    const {PurchaseID} = data;
    console.log(PurchaseID)
    axios
      .put(`${ServiceURL}/admin/update-payment`, { PurchaseID })
      .then((response) => {
        toast.success(response.data.message, { position: "top-right" });
        fetchData();
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const filterRows = (query) => {
    const filtered = rows.filter((row) => {
      return (
        row.PurchaseName.toLowerCase().includes(query.toLowerCase()) ||
        row.Quantity.toString().includes(query) || // Convert Quantity to string
        // row.Supplier.toLowerCase().includes(query.toLowerCase()) ||
        row.PurchaseDate.includes(query)
      );
    });
    return filtered;
  };
  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  const handleSort = () => {
    const sortedRows = [...filteredRows].sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (sortOrder === "asc") {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });
    setFilteredRows(sortedRows);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setSortField(value);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
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
          Purchase
        </Typography>
        <TextField label="Search" variant="outlined" onChange={handleSearch} />
        <FormControl variant="outlined">
          <InputLabel>Select Field</InputLabel>
          <Select
            value={sortField}
            onChange={handleSelectChange}
            label="Select Field"
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="PurchaseName">Purchase Name</MenuItem>
            <MenuItem value="Quantity">Quantity</MenuItem>
            <TableCell align="center">Purchased Amount</TableCell>

            <MenuItem value="Supplier">Supplier</MenuItem>
            <MenuItem value="PurchaseDate">Purchase Date</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleOpenDialog}>
          Add Purchase
        </Button>
      </Stack>
      {filteredRows.length === 0 ? (
        <Table sx={{ minWidth: 1000 }} aria-label="custom pagination table">
          <Typography variant="body1" align="center">
            No data
          </Typography>
        </Table>
      ) : (
        <Table sx={{ minWidth: 1000 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Purchased</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Purchased From</TableCell>
              <TableCell align="center">Purchase Date</TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filterRows(searchQuery).slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filterRows(searchQuery)
            ).map((row) => (
              <TableRow key={row.PurchaseID}>
                <TableCell style={{ width: 160 }} align="center">
                  {row.PurchaseName}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.Quantity}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.PurchaseAmount}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.FullName}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {formatDate(row.PurchaseDate)}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                {row.payment_status === 0 ? (
                    <Button
                    variant="contained"
                    onClick={() => UpdatePaymentStatus(row)}
                    >
                    Update Payment Status
                    </Button>
                ) : (
                    <Typography style={{ color: 'green' }}>Payment Processed</Typography>
                )}
                </TableCell>
                {row.approve_status === 1 && (
        <>
          {row.InvoiceImage && (
            <TableCell style={{ width: 160 }} align="center">
              <a href={`../../../../src/uploads/${row.InvoiceImage}`} download>
                {row.InvoiceImage.endsWith('.pdf') ? (
                  <Button
                    variant="contained"
                    onClick={() => {
                      window.open(`../../../../src/uploads/${row.InvoiceImage}`, '_blank');
                    }}
                  >
                    View Bill
                  </Button>
                ) : (
                  <img
                    src={`../../../../src/uploads/${row.InvoiceImage}`}
                    alt="Invoice"
                    style={{ width: "300px", height: "300px" }}
                  />
                )}
              </a>
            </TableCell>
          )}
          {row.payment_status !== undefined && (
            <TableCell style={{ width: 160, color: row.payment_status === 1 ? 'green' : 'yellow' }} align="center">
              {row.payment_status === 1 ? "Payment done" : "Payment pending"}
            </TableCell>
          )}
          {row.payment_date && (
            <TableCell style={{ width: 160 }} align="center">
              Payment Date: {formatDate(row.payment_date)}
            </TableCell>
          )}
        </>
      )}
      {row.approve_status === 2 && (
        <TableCell style={{ width: 160, color: 'red' }} align="center">
          Purchase not approved
        </TableCell>
      )}
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
            count={filterRows(searchQuery).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Table>
      )}
      {/* <Dialog open={openDialog} onClose={handleCloseDialog}>
        {editedCustomer ? (
          <EditRaw
            editedPurchase={editedCustomer}
            fetchData={fetchData}
            onClose={handleCloseDialog}
          />
        ) : (
          <Add
            onClose={handleCloseDialog}
            open={openDialog}
            fetchData={fetchData}
          />
        )}
      </Dialog> */}
    </TableContainer>
  );
}
