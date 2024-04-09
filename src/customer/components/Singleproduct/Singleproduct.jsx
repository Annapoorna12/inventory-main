import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./singleproduct.css";
import ServiceURL from "../../../constants/url";
import { Typography } from "@mui/material";

const Singleproduct = ({ allProductsData, addToCart, userID }) => {
  let { id } = useParams();
  const [product, setProduct] = useState(null);

  const getProductDetails = async (productId) => {
    try {
      const response = await axios.post(`${ServiceURL}/users/productDetails`, { productId });
      console.log(response.data.product);
      setProduct(response.data.product[0]);
    } catch (error) {
      console.error('Error fetching product details:', error);
      // Handle the error appropriately in your application
    }
  };

  useEffect(() => {
    getProductDetails(id);
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const stockStatus = product.Quantity > 0 ? 'In Stock' : 'Out of Stock';
  const stockColor = product.Quantity > 0 ? 'green' : 'red';

  return (
    <div key={product.ProductID}>
      <section className="single-product">
        <div className="heading-prod">{product.Name}</div>
        <div className="single-product-flex">
          <div className="single-img">
            <img src={`../../../../src/uploads/${product.productImage}`} alt="" />
            <div className="price">{product.Price}</div>
          </div>
          <div className="description">
            {product.Description}
            <div className="rate-single">
              <Typography variant="body2" color={stockColor}>
                {stockStatus}
              </Typography>
            </div>
          </div>
          {userID ? (
            <button
              aria-label="Add to cart"
              className="cart-add-btn"
              onClick={() => addToCart(product.ProductID)}
              disabled={product.Quantity <= 0}
            >
              {product.Quantity > 0 ? 'Add To Cart' : 'Out of Stock'}
            </button>
          ) : (
            <div>Please authenticate to add to cart</div>
          )}
        </div>
      </section>
    </div>
  );
};
export default Singleproduct;
