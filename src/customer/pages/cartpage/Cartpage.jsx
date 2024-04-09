import React, { useState, useEffect } from "react";
import Cart from "../../components/Cart/Cart";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import ServiceURL from "../../../constants/url";

import axios from "axios";
import { toast } from "react-toastify";

const Cartpage = ({
  productItems,
  addToCart,
  shopItems,
  checkOut,
  removeFromCart,
}) => {
  const [cartItems, setCartItems] = useState([]);
  const [userID, setUserID] = useState("");

  const fetchData = () => {
    axios
      .post(`${ServiceURL}/users/get-cart-data`, { userID: userID })
      .then((response) => {
        console.log(response.data.results);
        setCartItems(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching cart data:", error);
      });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("data"));

    if (userData != null) {
      console.log(userData[0].UserID);
      setUserID(userData[0].UserID);
    } else {
      setUserID("");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [userID]);

  const deleteFromCart = (data) => {
    const {cartChildID} = data; 
    axios
      .post(`${ServiceURL}/users/delete-from-cart`, {
        cartChildID: cartChildID,
      })
      .then((response) => {
        console.log(response.data);
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleting item from cart:", error);
      });
  };

  const updateCartQuantity = (cartChildID, action) => {
    console.log("Updating cart quantity", cartChildID, action);
    axios
      .post(`${ServiceURL}/users/updateCartQuantity`, {
        cartChildID: cartChildID,
        action: action,
      })
      .then((response) => {
        console.log(response.data);
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleting item from cart:", error);
      });
  };

  const CheckOutfunction = (cartMasterID) => {
    console.log("CheckOut function", cartMasterID, userID);
    axios
      .post(`${ServiceURL}/users/checkout`, {
        cartMasterID: cartMasterID,
        userID: userID,
      })
      .then((response) => {
        if (response.data.success) {
          toast.success(`${response.data.message}`);
          fetchData()
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      <Header productItems={productItems} cartItems={cartItems} />
      <Cart
        cartItems={cartItems}
        addToCart={addToCart}
        updateCartQuantity={updateCartQuantity}
        shopItems={shopItems}
        CheckOutfunction={CheckOutfunction}
        checkOut={checkOut}
        removeFromCart={deleteFromCart}
        userID={userID}
      />
      <Footer />
    </>
  );
};

export default Cartpage;
