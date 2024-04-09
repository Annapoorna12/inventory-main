import React, { useState,useEffect } from "react";
import Allproducts from "../../components/Allproducts/Allproducts";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import ServiceURL from "../../../constants/url";
import { useNavigate } from "react-router-dom";

const Allproductspage = ({ cartItems, allProductsData, addToCart }) => {
  const [userID ,setUserID] = useState('');

  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const fetchdata = () => {
      axios.get(`${ServiceURL}/users/view-active-products`).then(response=>{
        console.log(response.data.results)
        setProducts(response.data.results)
    })
  }

  

  useEffect(() =>{
    fetchdata();
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
      }).catch((error) =>{
        console.error(error);
      });
      navigate('/cart');
    }

  return (
    <>
      <Header cartItems={cartItems} />
      <Allproducts allProductsData={products}  fetchdata={fetchdata} addToCart={AddtoCart} userID={userID} />
      <Footer />
    </>
  );
};

export default Allproductspage;
