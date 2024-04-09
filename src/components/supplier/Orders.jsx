// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../Title';
import ServiceURL from '../../constants/url';

export default function Orders() {
  const [latestPayment, setLatestPayment] = useState(null);

  

  const fetchLatestPayment = () => {
    const userData = JSON.parse(localStorage.getItem('data'));
    let supplierId = '';
    if(userData.Role === 'Supplier') {

      supplierId = userData.data[0].UserID
    }
    axios.get(`${ServiceURL}/staff/supplier/${supplierId}/latest-payment`)
      .then(response => {
        setLatestPayment(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching latest payment:', error);
      });
  };

  useEffect(() => {
    fetchLatestPayment();
  }, []);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <React.Fragment>
      <Title>Recent Payments</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Payment Date</TableCell>
            <TableCell>Purchase Name</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {latestPayment && latestPayment.map((payment, index) => (
          <TableRow key={index}>
            <TableCell>{formatDate(payment.payment_date)}</TableCell> 
            <TableCell>{payment.PurchaseName}</TableCell> 
            <TableCell align="right">{`${payment.PurchaseAmount} ₹`}</TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
      <br />
      <Link color="primary" href="#" onClick={(event) => { event.preventDefault(); fetchLatestPayment(); }}>
        Refresh 
      </Link>
    </React.Fragment>
  );
}
