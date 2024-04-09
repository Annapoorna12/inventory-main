import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./allproducts.css";
import { Typography, FormControl, Select, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import ServiceURL from "../../../constants/url";

const Allproducts = ({ allProductsData, fetchdata, addToCart, userID }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchCategory = () => {
    axios.get(`${ServiceURL}/active-categories`)
      .then((response) => {
        console.log(response.data);
        setCategories(response.data);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    // Fetch all products when "None" is selected
    if (selectedCategory === "") {
      fetchdata();
    }
  }, [selectedCategory]);

  // Filter products based on selected category
  const filteredProducts = selectedCategory ? 
    allProductsData.filter((product) => product.CategoryID === selectedCategory) : 
    allProductsData;

  return (
    <>
      <h1 className="page-header">All Products</h1>
      <FormControl variant="outlined" style={{ margin: "auto", width: "50%", textAlign: "center" }}>
  <Typography variant="subtitle1" gutterBottom style={{ textAlign: "center" }}>
    Sort by Category
  </Typography>
  <Select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    displayEmpty
    inputProps={{ "aria-label": "Select category" }}
    style={{ marginLeft: "200px",width: "50%" }}
  >
    <MenuItem value="">
      None
    </MenuItem>
    {/* Display available categories */}
    {categories.map((category) => (
      <MenuItem key={category.CategoryID} value={category.CategoryID}>
        {category.CategoryName}
      </MenuItem>
    ))}
  </Select>
</FormControl>
      <div className="container grid3">
        {filteredProducts.length === 0 ? (
          <Typography variant="subtitle1" style={{ textAlign: "center" }}>
            No products available under this category.
          </Typography>
        ) : (
          filteredProducts.map((product, index) => (
            <div className="box" key={index}>
              <div className="product mtop">
                <div className="img">
                  <img src={`../../../../src/uploads/${product.productImage}`} alt="product-image" />
                </div>
                <div className="product-details">
                  <h3>{product.Name}</h3>
                  <Link to={`/all-products/${product.ProductID}`}>
                    <h5>Click here for more Info</h5>
                  </Link>
                  <div className="rate">
                    <Typography variant="body2" color={product.StockStatus === 'In Stock' ? 'green' : 'red'}>
                      {product.StockStatus}
                    </Typography>
                  </div>
                  <div className="price">
                    <h4>{product.Price}</h4>
                    <button
                      aria-label="Add to cart"
                      onClick={() => {
                        if (userID && product.StockStatus === 'In Stock') {
                          addToCart(product.ProductID);
                          toast.success('Product added successfully')
                        } else {
                          if (!userID) {
                            toast.error('Please log in to add the product to the cart.')
                          } else {
                            toast.error('Oops This product is Out of Stock.')
                          }
                        }
                      }}
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Allproducts;
