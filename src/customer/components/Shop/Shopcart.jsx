import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";


const Shopcart = ({ shopItems, addToCart,userID }) => {
  
  const handleAddtoCart = (productID)=>{
    addToCart(productID)
  }

  return (
    <>
      {shopItems.map((product, index) => {
        return (
          <div className="box" key={index}>
            <div className="product mtop">
              <div className="image">
                {/* <span className="discount">{product.discount}% Off</span> */}
                <img src={`../../../../src/uploads/${product.productImage}`} alt="" />
                {/* <div className="product-like">
                  <label>{count}</label> <br />
                  <i className="fa-regular fa-heart" onClick={increment}></i>
                </div> */}
              </div>
              <div className="product-details">
                <Link to={`/all-products/${product.ProductID}`}>
                  <h3 className="truncate">{product.Name}</h3>
                </Link>
                {/* <div className="rate">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                </div> */}
                <div className="price">
                  <h4>{product.Price}</h4>
                   
                  <button
                    aria-label="Add to cart"
                    onClick={() => {
                      console.log(userID)
                      if(userID === ''){
                        toast.error('Please Login to Add Products to your cart');
                      }else{
                        handleAddtoCart(product.ProductID)
                      }
                    }}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Shopcart;
