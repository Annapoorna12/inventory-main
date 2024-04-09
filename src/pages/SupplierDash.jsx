import React from 'react';
import { Grid, Paper } from '@mui/material';
// import Deposits from '../components/Deposits';
// import Chart from '../components/Chart';
import Orders from '../components/supplier/Orders';
import SupplierLayout from '../layout/SupplierLayout';

const SupplierDash = () => {
  return (
    <SupplierLayout>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Orders />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        {/* <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Deposits />
          </Paper>
        </Grid> */}
        {/* Recent Orders */}
        {/* <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Orders />
          </Paper>
        </Grid> */}
      </Grid>
    </SupplierLayout>
  );
};

export default SupplierDash;
