import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { LineChart, BarChart, axisClasses } from "@mui/x-charts";
import { Button, TextField } from "@mui/material";
import axios from "axios";

import Title from "./Title";
import ServiceURL from "../constants/url";

export default function Chart() {
  const theme = useTheme();
  const [salesData, setSalesData] = React.useState([]);
  const [view, setView] = React.useState("month");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const fetchdata = () => {
    axios
      .get(`${ServiceURL}/admin/GetOrderDetails`)
      .then((response) => {
        if (response.data && response.data.orders) {
          const dataWithIds = response.data.orders.map((item, index) => ({
            ...item,
            id: index + 1,
            ProductDetails: JSON.parse(item.ProductDetails),
          }));
          setSalesData(dataWithIds);
        } else {
          setSalesData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
        setSalesData([]);
      });
  };

  React.useEffect(() => {
    fetchdata();
  }, []);

  const handleViewChange = (view) => {
    console.log(view);
    setStartDate("")
    setEndDate("")
    setView(view);
  };

  const handleStartDateChange = (event) => {
    
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleSubmit = () => {
    console.log(startDate, endDate);
    if (!startDate || !endDate) {
      console.error("Please select both start date and end date.");
      return;
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const filteredData = salesData.filter((item) => {
      const orderDate = new Date(item.OrderDate);
      return orderDate >= startDateObj && orderDate <= endDateObj;
    });

    console.log("Filtered data based on selected date range:", filteredData);
  };

  const getData = () => {
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      // Filter sales data between the selected start and end dates
      const filteredData = salesData.filter((item) => {
        const orderDate = new Date(item.OrderDate);
        return orderDate >= startDateObj && orderDate <= endDateObj;
      });

      // If there is no data in the selected date range, return an empty array
      if (filteredData.length === 0) return [];

      // Extract years with order dates within the selected range
      const years = {};
      filteredData.forEach((item) => {
        const year = new Date(item.OrderDate).getFullYear();
        years[year] = true;
      });

      // Generate data for years with order dates within the selected range
      const data = Object.keys(years).map((year) => ({
        x: year,
        y: filteredData.reduce((total, item) => {
          const orderYear = new Date(item.OrderDate).getFullYear();
          return orderYear === parseInt(year)
            ? total + parseFloat(item.TotalAmount)
            : total;
        }, 0),
      }));

      return data;
    } else {
      if (view === "month") {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Filter data for the current month
        const filteredData = salesData.filter((item) => {
          const orderDate = new Date(item.OrderDate);
          return (
            orderDate.getMonth() === currentMonth &&
            orderDate.getFullYear() === currentYear
          );
        });

        // Generate data for each day in the current month
        const data = Array.from(
          { length: new Date(currentYear, currentMonth + 1, 0).getDate() },
          (_, dayIndex) => {
            const day = dayIndex + 1;
            const dayData = filteredData.filter(
              (item) => new Date(item.OrderDate).getDate() === day
            );
            const totalAmount = dayData.reduce(
              (sum, item) => sum + parseFloat(item.TotalAmount),
              0
            );
            return {
              x: day,
              y: totalAmount,
            };
          }
        );

        return data;
      } else if (view === "year") {
        const currentYear = new Date().getFullYear();
        // Filter data for the current year
        const filteredData = salesData.filter(
          (item) => new Date(item.OrderDate).getFullYear() === currentYear
        );

        // Generate data for each month in the current year with month names
        const data = Array.from({ length: 12 }, (_, monthIndex) => {
          const monthData = filteredData.filter(
            (item) => new Date(item.OrderDate).getMonth() === monthIndex
          );
          const totalAmount = monthData.reduce(
            (sum, item) => sum + parseFloat(item.TotalAmount),
            0
          );
          return {
            x: new Date(currentYear, monthIndex, 1).toLocaleString("default", {
              month: "short",
            }),
            y: totalAmount,
          };
        });
        // console.log(data);
        return data;
      }
    }
  };

  return (
    <React.Fragment>
      <Title>Sales of This {view}</Title>
      <div>
        <Button onClick={() => handleViewChange("month")}>This Month</Button>
        <Button onClick={() => handleViewChange("year")}>This Year</Button>
      </div>
      <div>
        <TextField
          id="start-date"
          label="Start Date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="end-date"
          label="End Date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      <div style={{ width: "100%", flexGrow: 1, overflow: "hidden" }}>
        <BarChart
          dataset={getData()}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: "band", // Set scaleType to 'band' for x-axis
              dataKey: "x",
              tickLabelStyle: theme.typography.body2,
            },
          ]}
          yAxis={[
            {
              label: "Price (₹)",
              labelStyle: {
                ...theme.typography.body1,
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2,
              tickNumber: 3,
            },
          ]}
          series={[
            {
              dataKey: "y",
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: {
              stroke: theme.palette.text.secondary,
            },
            [`.${axisClasses.root} text`]: {
              fill: theme.palette.text.secondary,
            },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: "translateX(-25px)",
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}
