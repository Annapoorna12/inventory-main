import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import PaymentsIcon from '@mui/icons-material/Payments';
import { Link } from 'react-router-dom';



export const mainListItems = (
  <React.Fragment>
    <Link  style={{ textDecoration: 'none', color: 'inherit' }} to={'/dashboard'}>
      <ListItemButton>
        <ListItemIcon>
            <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </Link>
    <Link  style={{ textDecoration: 'none', color: 'inherit' }} to={'/Categories'}>
      <ListItemButton>
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary="Categories" />
      </ListItemButton>
    </Link>
    <Link  style={{ textDecoration: 'none', color: 'inherit' }} to={'/Customers'}>
     <ListItemButton>
      <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
          <ListItemText primary="Customers" />
      </ListItemButton>
    </Link>
    <Link  style={{ textDecoration: 'none', color: 'inherit' }} to={'/Employee'}>
      <ListItemButton>
        <ListItemIcon>
          <PeopleOutlineIcon />
        </ListItemIcon>
        <ListItemText primary="Employee" />
      </ListItemButton>
    </Link>
    <Link  style={{ textDecoration: 'none', color: 'inherit' }} to={'/SalesManager'}>
      <ListItemButton>
        <ListItemIcon>
          <PeopleOutlineIcon />
        </ListItemIcon>
        <ListItemText primary="Sales Manager" />
      </ListItemButton>
    </Link>
  
    <Link  style={{ textDecoration: 'none', color: 'inherit' }} to={'/supplier'}>
      <ListItemButton>
        <ListItemIcon>
          <PeopleOutlineIcon />
        </ListItemIcon>
        <ListItemText primary="Supplier" />
      </ListItemButton>
    </Link>
    <Link  style={{ textDecoration: 'none', color: 'inherit' }} to={'/products'}>
      <ListItemButton>
        <ListItemIcon>
          <InventoryIcon />
        </ListItemIcon>
        <ListItemText primary="Products" />
      </ListItemButton>
    </Link>

    <Link  style={{ textDecoration: 'none', color: 'inherit' }} to={'/sales'}>
      <ListItemButton>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItemButton>
    </Link>
    
    <Link  style={{ textDecoration: 'none', color: 'inherit' }} to={'/pay'}>
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Purchases" />
      </ListItemButton>
    </Link>
    <Link  style={{ textDecoration: 'none', color: 'inherit' }} to={'/Wages'}>
      <ListItemButton>
        <ListItemIcon>
          <PaymentsIcon />
        </ListItemIcon>
        <ListItemText primary="Wages" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);
