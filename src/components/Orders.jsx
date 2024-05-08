import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import axios from 'axios';

import ServiceURL from '../constants/url';


export default function Orders() {
  const [salesData, setSalesData] = React.useState([]);

  const fetchdata = () => {
    axios.get(`${ServiceURL}/admin/GetOrderDetails`).then(response => {
      if (response.data && response.data.orders) {
        const dataWithIds = response.data.orders.map((item, index) => ({
          ...item,
          id: index + 1,
          ProductDetails: JSON.parse(item.ProductDetails),
        }));
        console.log(dataWithIds);
        setSalesData(dataWithIds);
        const sortedData = dataWithIds.sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate));

        setSalesData(sortedData);
      } else {
        setSalesData([]);
      }
    }).catch(error => {
      console.error('Error fetching order details:', error);
      setSalesData([]);
    });
  };

  React.useEffect(() => {
    fetchdata();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {salesData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{formatDate(row.OrderDate)}</TableCell> {/* Assuming OrderDate is the date field */}
              <TableCell>{row.FullName}</TableCell> 
              <TableCell align="right">{`${row.TotalAmount} ₹`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <br></br>
      <Link color="primary" href="#" onClick={(event) => { event.preventDefault(); fetchdata(); }}>
        Refresh Orders
      </Link>
    </React.Fragment>
  );
}
