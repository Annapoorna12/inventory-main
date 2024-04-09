import React, { useEffect, useState } from "react";
import Singleproduct from "../../components/Singleproduct/Singleproduct";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import ServiceURL from "../../../constants/url";
import { useNavigate } from "react-router-dom";

const Singleproductpage = ({ allProductsData, cartItems, addToCart }) => {
  const [userID ,setUserID] = useState('');
  const navigate = useNavigate();

  useEffect(() =>{
    const userData = JSON.parse(localStorage.getItem('data'));
    if (userData != null) {
      console.log(userData[0].UserID);
      setUserID(userData[0].UserID);
    } else {
      setUserID('');
    }
  },[])

  const AddtoCart = (productID) => {
    console.log('AddtoCart', productID,userID)
    axios.post(`${ServiceURL}/users/addtocart`,{
      userID: userID,
      productID: productID
    }).then((response) => {
        console.log(response.data);
        navigate('/cart');
        if(response.data.success){
          
        }
    }).catch((error) =>{
      console.error(error);
    });
  }

  return (
    <>
      <Header cartItems={cartItems} />
      <Singleproduct allProductsData={allProductsData} addToCart={AddtoCart} userID={userID} />
      <Footer />
    </>
  );
};

export default Singleproductpage;
