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
      <div className="header-container" style={{ display: 'flex', alignItems: 'center' }} >
        <Search cartItems={cartItems} />
        {/* <Navbar /> */}
      </div>
    </>
  );
};

export default Header;
