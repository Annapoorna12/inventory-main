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
import ServiceURL from "../../constants/url";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

// Modal dialog
// import Add from "./add";
// import EditRaw from "./EditRawMaterailPurchase";

export default function Supplierpayout() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [sortField, setSortField] = useState(""); // State for the selected sorting field
  const [sortOrder, setSortOrder] = useState("asc"); // State for sorting order
  const [rows, setRows] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);


  const fetchData = () => {
    const userData = JSON.parse(localStorage.getItem("data"));
    let id = "";
    if (userData && userData.data && userData.data.length > 0) {
      id = userData.data[0].UserID;
    }
    axios
      .get(`${ServiceURL}/staff/supplier-payoutlist`, {
        params: { SupplierID: id },
      })
      .then((response) => {
        console.log(response.data);
        setRows(response.data.purchases);
        setFilteredRows(response.data.purchases);
      })
      .catch((error) => {
        console.error("Error fetching:", error);
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

  const UserStatusUpdate = (data) => {
    axios
      .put(`${ServiceURL}/admin/UpdateUserStatus`, { data })
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



    const handleFileInputChange = (event) => {
    setSelectedImage(event.target.files[0]);
    };

    const handleImageUpload = (id) => {
        if(selectedImage == null){
            toast.error("Bill Image is required")
            return;
        }
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("id", id);

    axios.post(`${ServiceURL}/upload-image`, formData,{
        headers: {
          "Content-Type": "multipart/form-data"
        }}).then((response) => {
        console.log("Image uploaded successfully:", response.data);
        fetchData();
        })
        .catch((error) => {
        console.error("Error uploading image:", error);
        });
    };


    const handleApprove = (purchaseID) => {
        axios
          .put(`${ServiceURL}/staff/update-approve-status/${purchaseID}`, { status: 1 }) // status 1 for approve
          .then((response) => {
            if(response.status === 200){
                toast.success('Approved')
            }
            fetchData()
            console.log("Approval status updated successfully");
          })
          .catch((error) => {
            console.error("Error updating approval status:", error);
          });
      };
      
      const handleReject = (purchaseID) => {
        axios
          .put(`${ServiceURL}/staff/update-approve-status/${purchaseID}`, { status: 2 }) // status 2 for reject
          .then((response) => {
            if(response.status === 200){
                toast.error('Rejected')
            }
            fetchData()
            console.log("Rejection status updated successfully");
          })
          .catch((error) => {
            // Handle error
            console.error("Error updating rejection status:", error);
          });
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
            <MenuItem value="PurchaseDate">Purchase Date</MenuItem>
          </Select>
        </FormControl>
        {/* <Button variant="contained" onClick={handleOpenDialog}>
          Add Purchase
        </Button> */}
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
                  {formatDate(row.PurchaseDate)}
                </TableCell>
                {row.approve_status === 2 && (
                <TableCell style={{ width: 160, color: 'red' }} align="center">
                    Purchase Rejected
                </TableCell>
                )}
                {row.approve_status === 0 ? (
              <>
                <TableCell style={{ width: 160 }} align="center">
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleApprove(row.PurchaseID);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    Approve
                  </Button>
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleReject(row.PurchaseID);
                    }}
                  >
                    Reject
                  </Button>
                </TableCell>
              </>
            ) : (
              <>
                {row.approve_status === 1 && row.payment_status == 0 && (
                  <TableCell style={{ width: 160 }} align="center">
                    {/* File input to select image */}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileInputChange}
                      id="image-input"
                    />
                    {/* IconButton with camera icon */}
                    <label htmlFor="image-input">
                      <IconButton
                        component="span"
                        style={{ marginRight: 8 }}
                      >
                        <PhotoCameraIcon />
                      </IconButton>
                    </label>
                    {/* Button to trigger image upload */}
                    <Button
                      variant="contained"
                      onClick={()=>{handleImageUpload(row.PurchaseID)}}
                    >
                      Upload Bill
                    </Button>
                  </TableCell>
                )}
                <>
                  {row.InvoiceImage && row.approve_status === 1 && (
                    <TableCell style={{ width: 160 }} align="center">
                      <a href={row.InvoiceImage} download>
                        {row.InvoiceImage.endsWith('.pdf') ? (
                            // Render PDF viewer if the file is a PDF
                            <Button
                            variant="contained"
                            onClick={() => {
                              window.open(`../../../src/uploads/${row.InvoiceImage}`, '_blank');
                            }}
                          >
                            View Bill
                          </Button>
                            // <embed
                            // src={`../../../src/uploads/${row.InvoiceImage}`}
                            // type="application/pdf"
                            // width="100"
                            // height="100"
                            // />
                        ) : (
                            // Render image if the file is an image
                            <img
                            src={`../../../src/uploads/${row.InvoiceImage}`}
                            alt="Invoice"
                            style={{ width: "100px", height: "100px" }}
                            />
                        )}
                        </a>
                    </TableCell>
                  )}
                  {/* Check if payment_status is present */}
                  {row.payment_status !== undefined && row.approve_status === 1 && (
                    <TableCell style={{ width: 160 }} align="center">
                      <Typography>
                        {row.payment_status === 1
                          ? "Payment done"
                          : "Payment pending"}
                      </Typography>
                    </TableCell>
                  )}
                  {/* Check if payment_date is present */}
                  {row.payment_date && row.approve_status === 1 && (
                    <TableCell style={{ width: 160 }} align="center">
                      <Typography variant="body2" align="center">
                        Payment Date: {formatDate(row.payment_date)}
                      </Typography>
                    </TableCell>
                  )}
                  {row.notification && row.approve_status === 1 && (
                    <TableCell style={{ width: 160 }} align="center">
                    <Typography variant="body2" align="center" style={{ color: 'orange', fontWeight: 'bold' }}>
                      Notification from Sales: {row.notification}
                    </Typography>
                  </TableCell>
                  )}
                </>
              </>
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
