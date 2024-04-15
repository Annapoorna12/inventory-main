import React, { useState } from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import "./Header.css";


const Header = ({ cartItems }) => {


  return (
    <>
      {/* <Head /> */}
      {/* <Search cartItems={cartItems} />
      <Navbar /> */}
      <div className="header-container" style={{ display: 'flex', alignItems: 'center', backgroundColor:'white', height:'125px' }} >
        <Search />
        <Navbar cartItems={cartItems} />
      </div>
    </>
  );
};

export default Header;
