import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Mainpage from "../../components/Mainpage/Mainpage";
import Shop from "../../components/Shop/Shop";


const Homepage = ({ productItems, addToCart, cartItems, shopItems }) => {
  // Homepage consists of different smaller components I made so we can reuse them later when needed and sending different components necessary props to use them in there
  return (
    <>
      <Header cartItems={cartItems} />
      {/* <Mainpage /> */}
      {/* <Flashdeals productItems={productItems} addToCart={addToCart} /> */}
      {/* <TopCategories /> */}
      {/* <Newarrivals /> */}
      {/* <Discount /> */}
      <Shop shopItems={shopItems} addToCart={addToCart} />
      {/* <Specialoffer /> */}
      {/* <Features /> */}
      <Footer />
    </>
  );
};

export default Homepage;
