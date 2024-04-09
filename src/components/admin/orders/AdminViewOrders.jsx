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
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { GetApp as GetAppIcon } from "@mui/icons-material";
import AssessmentIcon from '@mui/icons-material/Assessment';

import { generateInvoicePDF, generateSalesReport } from "./bill";
import ServiceURL from "../../../constants/url";
import {toast} from "react-toastify";

export default function AdminViewOrders() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [salesData, setSalesData] = useState([]);
  const [filteredSalesData, setFilteredSalesData] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("orderDate");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredSalesData.length - page * rowsPerPage);

  const fetchData = () => {
    axios.get(`${ServiceURL}/admin/GetOrderDetails`).then(response => {
      if (response.data && response.data.orders) {
        const dataWithIds = response.data.orders.map((item, index) => ({
          ...item,
          id: index + 1,
          ProductDetails: JSON.parse(item.ProductDetails),
        }));
        console.log(dataWithIds)
        setSalesData(dataWithIds);
        setFilteredSalesData(dataWithIds);
      } else {
        setSalesData([]);
        setFilteredSalesData([]);
      }
    }).catch(error => {
      console.error('Error fetching order details:', error);
      setSalesData([]);
      setFilteredSalesData([]);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filteredData = salesData.filter((row) => {
        return (
        row.FullName.toLowerCase().includes(query.toLowerCase()) || 
        row.OrderDate.includes(query) ||
        row.TotalAmount.includes(query)
      )}
    );
    setFilteredSalesData(filteredData);
  };

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

    const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };


  const handlePrintSalesReport = () => {
    if (startDate && endDate) {
      // Filter sales data based on the selected date range
      const filteredData = salesData.filter((item) => {
        const orderDate = new Date(item.OrderDate);
        console.log(orderDate);
        const startDateObj = new Date(startDate + 'T00:00:00.000Z');
        console.log("start:",startDateObj);
        const endDateObj = new Date(endDate + 'T23:59:59.999Z');
        console.log("end:",endDateObj);
        return orderDate >= startDateObj && orderDate <= endDateObj;
      });
      console.log(filteredData)
      if (filteredData.length === 0) {
        console.log("hello")
        toast.error('No data found for the selected date range');
        return;
      }    
      generateSalesReport(filteredData);
    } else {
      generateSalesReport(salesData);
    }
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
          Orders / Sales
        </Typography>
        <IconButton onClick={()=>{handlePrintSalesReport()}}>
          <AssessmentIcon />
        </IconButton>
        <TextField placeholder="Search by name" onChange={handleSearch} />
        <FormControl variant="outlined">
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            value={sortCriteria}
            onChange={handleSortChange}
          >
            <MenuItem value="orderDate">Order Date</MenuItem>
            <MenuItem value="fullName">Customer Name</MenuItem>
            <MenuItem value="TotalAmount">Total Amount</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="start-date"
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="end-date"
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Stack>
      <Table sx={{ minWidth: 1000 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Order Date</TableCell>
            <TableCell align="center">Customer Name</TableCell>
            <TableCell align="center">Total Price / Without GST</TableCell>
            <TableCell align="center">Download Bill</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? filteredSalesData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : filteredSalesData
          ).map((row) => (
            <TableRow key={row.id}>
              <TableCell style={{ width: 160 }} align="center">
                {formatDate(row.OrderDate)}
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                {row.FullName}
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                {row.TotalAmount}
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
              <IconButton onClick={() => generateInvoicePDF(row)}>
                 <GetAppIcon />
              </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {rowsPerPage > 0 && emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          colSpan={3}
          count={filteredSalesData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Table>
    </TableContainer>
  );
}
