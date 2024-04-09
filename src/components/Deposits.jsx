import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import axios from 'axios';
import ServiceURL from '../constants/url';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export default function Deposits() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(`${ServiceURL}/admin/getdata`).then(response => {
      const responseData = response.data;
      // Convert the provided data into an array of objects
      const data = Object.entries(responseData).map(([key, value]) => ({
        name: key,
        value: typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value
      }));
      console.log(data)
      setChartData(data);
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  };

  return (
    <React.Fragment>
      <Title>Over All Analysis</Title>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PieChart width={300} height={250}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {
              chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))
            }
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </React.Fragment>
  );
}
